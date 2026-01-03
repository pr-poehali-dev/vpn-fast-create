-- Таблица серверов VPN
CREATE TABLE IF NOT EXISTS vpn_servers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    country VARCHAR(100) NOT NULL,
    city VARCHAR(100),
    ip_address VARCHAR(45) NOT NULL,
    port INTEGER NOT NULL DEFAULT 51820,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    config_type VARCHAR(50) NOT NULL DEFAULT 'amnezia',
    config_data TEXT NOT NULL,
    ssh_host VARCHAR(255),
    ssh_port INTEGER DEFAULT 22,
    ssh_user VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    ping_ms INTEGER,
    bandwidth_mbps INTEGER,
    max_users INTEGER DEFAULT 100,
    current_users INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица пользователей
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT false,
    subscription_end TIMESTAMP,
    data_transferred_gb DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица подключений пользователей к серверам
CREATE TABLE IF NOT EXISTS user_connections (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    server_id INTEGER,
    connected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    disconnected_at TIMESTAMP,
    data_uploaded_mb DECIMAL(10, 2) DEFAULT 0,
    data_downloaded_mb DECIMAL(10, 2) DEFAULT 0,
    avg_ping_ms INTEGER
);

-- Индексы для оптимизации
CREATE INDEX IF NOT EXISTS idx_vpn_servers_active ON vpn_servers(is_active);
CREATE INDEX IF NOT EXISTS idx_vpn_servers_country ON vpn_servers(country);
CREATE INDEX IF NOT EXISTS idx_user_connections_user_id ON user_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_user_connections_server_id ON user_connections(server_id);

-- Демо-данные (один админ)
INSERT INTO users (email, password_hash, is_admin, subscription_end)
VALUES ('admin@vpnguard.local', 'demo_hash_replace_later', true, '2026-12-31')
ON CONFLICT (email) DO NOTHING;