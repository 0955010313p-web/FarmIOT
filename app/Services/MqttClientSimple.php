<?php

namespace App\Services;

/**
 * Minimal MQTT 3.1.1 publisher over TCP without external deps.
 * Supports: CONNECT (with username/password), PUBLISH QoS0, DISCONNECT.
 */
class MqttClientSimple
{
    protected string $host;
    protected int $port;
    protected ?string $username;
    protected ?string $password;
    protected int $keepAlive;
    protected $socket = null;

    public function __construct(string $host, int $port = 1883, ?string $username = null, ?string $password = null, int $keepAlive = 60)
    {
        $this->host = $host;
        $this->port = $port;
        $this->username = $username;
        $this->password = $password;
        $this->keepAlive = $keepAlive;
    }

    public function connect(string $clientId = null): void
    {
        $clientId = $clientId ?? ('laravel-' . bin2hex(random_bytes(4)));
        $this->socket = @fsockopen($this->host, $this->port, $errno, $errstr, 5);
        if (!$this->socket) {
            throw new \RuntimeException("MQTT TCP connect failed: {$errstr} ({$errno})");
        }

        // Build CONNECT packet (MQTT 3.1.1)
        $protocolName = "\x00\x04MQTT";
        $protocolLevel = "\x04";
        $connectFlags = 0x02; // Clean session
        $payload = $this->encodeString($clientId);
        if ($this->username !== null) {
            $connectFlags |= 0x80; // username flag
            $payload .= $this->encodeString($this->username);
            if ($this->password !== null) {
                $connectFlags |= 0x40; // password flag
                $payload .= $this->encodeString($this->password);
            }
        }
        $keepAlive = pack('n', $this->keepAlive);
        $variableHeader = $protocolName . $protocolLevel . chr($connectFlags) . $keepAlive;
        $fixedHeader = chr(0x10) . $this->encodeRemainingLength(strlen($variableHeader) + strlen($payload));
        $packet = $fixedHeader . $variableHeader . $payload;
        fwrite($this->socket, $packet);

        // Read CONNACK (expect 2 bytes after fixed header)
        $this->readPacket(4); // simple read to ensure broker responded
    }

    public function publish(string $topic, string $message): void
    {
        if (!$this->socket) {
            throw new \RuntimeException('MQTT socket not connected');
        }
        $topicBin = $this->encodeString($topic);
        $payload = $topicBin . $message; // QoS0, no packet identifier
        $fixedHeader = chr(0x30) . $this->encodeRemainingLength(strlen($payload));
        fwrite($this->socket, $fixedHeader . $payload);
    }

    public function disconnect(): void
    {
        if ($this->socket) {
            fwrite($this->socket, chr(0xE0) . chr(0x00)); // DISCONNECT
            fclose($this->socket);
            $this->socket = null;
        }
    }

    protected function encodeString(string $str): string
    {
        return pack('n', strlen($str)) . $str;
    }

    protected function encodeRemainingLength(int $len): string
    {
        $encoded = '';
        do {
            $byte = $len % 128;
            $len = intdiv($len, 128);
            if ($len > 0) {
                $byte |= 0x80;
            }
            $encoded .= chr($byte);
        } while ($len > 0);
        return $encoded;
    }

    protected function readPacket(int $len): void
    {
        stream_set_timeout($this->socket, 2);
        fread($this->socket, $len);
    }
}
