import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: dict, context) -> dict:
    '''API для управления VPN серверами - добавление, получение списка, проверка доступности'''
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Database configuration missing'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(dsn)
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        if method == 'GET':
            params = event.get('queryStringParameters') or {}
            active_only = params.get('active', 'true').lower() == 'true'
            
            if active_only:
                cursor.execute("""
                    SELECT id, name, country, city, ip_address, port, 
                           latitude, longitude, config_type, is_active, 
                           ping_ms, bandwidth_mbps, current_users, max_users
                    FROM vpn_servers 
                    WHERE is_active = true
                    ORDER BY ping_ms ASC NULLS LAST
                """)
            else:
                cursor.execute("""
                    SELECT id, name, country, city, ip_address, port, 
                           latitude, longitude, config_type, is_active, 
                           ping_ms, bandwidth_mbps, current_users, max_users,
                           created_at, updated_at
                    FROM vpn_servers 
                    ORDER BY created_at DESC
                """)
            
            servers = cursor.fetchall()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'servers': [dict(s) for s in servers]}, default=str),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            
            cursor.execute("""
                INSERT INTO vpn_servers 
                (name, country, city, ip_address, port, latitude, longitude, 
                 config_type, config_data, ssh_host, ssh_port, ssh_user, 
                 ping_ms, bandwidth_mbps, max_users)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id, name, country, ip_address
            """, (
                body.get('name'),
                body.get('country'),
                body.get('city'),
                body.get('ip_address'),
                body.get('port', 51820),
                body.get('latitude'),
                body.get('longitude'),
                body.get('config_type', 'amnezia'),
                body.get('config_data'),
                body.get('ssh_host'),
                body.get('ssh_port', 22),
                body.get('ssh_user'),
                body.get('ping_ms'),
                body.get('bandwidth_mbps'),
                body.get('max_users', 100)
            ))
            
            server = cursor.fetchone()
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True, 'server': dict(server)}),
                'isBase64Encoded': False
            }
        
        elif method == 'DELETE':
            params = event.get('queryStringParameters') or {}
            server_id = params.get('id')
            
            if not server_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Server ID required'}),
                    'isBase64Encoded': False
                }
            
            cursor.execute("UPDATE vpn_servers SET is_active = false WHERE id = %s", (server_id,))
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True, 'message': 'Server deactivated'}),
                'isBase64Encoded': False
            }
        
        else:
            return {
                'statusCode': 405,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Method not allowed'}),
                'isBase64Encoded': False
            }
    
    finally:
        cursor.close()
        conn.close()
