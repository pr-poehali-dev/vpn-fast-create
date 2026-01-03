import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
import math

def handler(event: dict, context) -> dict:
    '''API для автоматического подбора оптимального сервера по геолокации пользователя'''
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
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
    
    body = json.loads(event.get('body', '{}'))
    user_lat = body.get('latitude')
    user_lon = body.get('longitude')
    
    if user_lat is None or user_lon is None:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Latitude and longitude required'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(dsn)
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        cursor.execute("""
            SELECT id, name, country, city, ip_address, port, 
                   latitude, longitude, config_data, config_type,
                   ping_ms, bandwidth_mbps, current_users, max_users
            FROM vpn_servers 
            WHERE is_active = true 
              AND current_users < max_users
              AND latitude IS NOT NULL 
              AND longitude IS NOT NULL
        """)
        
        servers = cursor.fetchall()
        
        if not servers:
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'No available servers'}),
                'isBase64Encoded': False
            }
        
        def calculate_distance(lat1, lon1, lat2, lon2):
            R = 6371
            
            lat1_rad = math.radians(float(lat1))
            lat2_rad = math.radians(float(lat2))
            delta_lat = math.radians(float(lat2) - float(lat1))
            delta_lon = math.radians(float(lon2) - float(lon1))
            
            a = (math.sin(delta_lat / 2) ** 2 + 
                 math.cos(lat1_rad) * math.cos(lat2_rad) * 
                 math.sin(delta_lon / 2) ** 2)
            c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
            
            return R * c
        
        def calculate_score(server):
            distance = calculate_distance(
                user_lat, user_lon,
                server['latitude'], server['longitude']
            )
            
            ping_penalty = server['ping_ms'] if server['ping_ms'] else 50
            load_penalty = (server['current_users'] / server['max_users']) * 100
            
            score = distance + ping_penalty + load_penalty
            
            return score
        
        best_server = min(servers, key=calculate_score)
        
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'server': dict(best_server),
                'reason': 'Optimal by location, ping and load'
            }, default=str),
            'isBase64Encoded': False
        }
    
    except Exception as e:
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
