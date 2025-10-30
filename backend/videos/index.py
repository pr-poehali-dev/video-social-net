'''
Business: API для работы с видео, каналами и комментариями
Args: event - dict с httpMethod, body, queryStringParameters
      context - object с attributes: request_id, function_name
Returns: HTTP response dict
'''

import json
import os
from typing import Dict, Any, Optional
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime

def get_db_connection():
    database_url = os.environ.get('DATABASE_URL')
    return psycopg2.connect(database_url, cursor_factory=RealDictCursor)

def format_time_ago(created_at: datetime) -> str:
    now = datetime.now()
    diff = now - created_at
    
    if diff.days > 365:
        years = diff.days // 365
        return f'{years} год назад' if years == 1 else f'{years} лет назад'
    elif diff.days > 30:
        months = diff.days // 30
        return f'{months} месяц назад' if months == 1 else f'{months} месяцев назад'
    elif diff.days > 0:
        return f'{diff.days} день назад' if diff.days == 1 else f'{diff.days} дня назад' if diff.days < 5 else f'{diff.days} дней назад'
    elif diff.seconds > 3600:
        hours = diff.seconds // 3600
        return f'{hours} час назад' if hours == 1 else f'{hours} часа назад' if hours < 5 else f'{hours} часов назад'
    elif diff.seconds > 60:
        minutes = diff.seconds // 60
        return f'{minutes} минуту назад' if minutes == 1 else f'{minutes} минуты назад' if minutes < 5 else f'{minutes} минут назад'
    else:
        return 'только что'

def format_views(count: int) -> str:
    if count >= 1000000:
        return f'{count / 1000000:.1f}M'
    elif count >= 1000:
        return f'{count / 1000:.0f}K'
    else:
        return str(count)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        if method == 'GET':
            params = event.get('queryStringParameters') or {}
            video_id = params.get('video_id')
            
            if video_id:
                cursor.execute('''
                    SELECT v.*, c.name as channel_name, c.avatar_url as channel_avatar, c.subscribers_count
                    FROM videos v
                    JOIN channels c ON v.channel_id = c.id
                    WHERE v.id = %s
                ''', (video_id,))
                video = cursor.fetchone()
                
                if not video:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Video not found'})
                    }
                
                cursor.execute('''
                    SELECT * FROM comments 
                    WHERE video_id = %s AND parent_comment_id IS NULL 
                    ORDER BY created_at DESC
                ''', (video_id,))
                comments = cursor.fetchall()
                
                for comment in comments:
                    cursor.execute('''
                        SELECT * FROM comments 
                        WHERE parent_comment_id = %s 
                        ORDER BY created_at ASC
                    ''', (comment['id'],))
                    comment['replies'] = []
                    for reply in cursor.fetchall():
                        comment['replies'].append({
                            'id': str(reply['id']),
                            'author': reply['author_name'],
                            'avatar': reply['author_avatar'],
                            'text': reply['text'],
                            'likes': reply['likes_count'],
                            'time': format_time_ago(reply['created_at'])
                        })
                
                formatted_comments = [{
                    'id': str(c['id']),
                    'author': c['author_name'],
                    'avatar': c['author_avatar'],
                    'text': c['text'],
                    'likes': c['likes_count'],
                    'time': format_time_ago(c['created_at']),
                    'replies': c['replies']
                } for c in comments]
                
                result = {
                    'id': str(video['id']),
                    'title': video['title'],
                    'description': video['description'],
                    'channel': video['channel_name'],
                    'channelAvatar': video['channel_avatar'],
                    'subscribersCount': format_views(video['subscribers_count']),
                    'views': format_views(video['views_count']),
                    'likes': format_views(video['likes_count']),
                    'time': format_time_ago(video['created_at']),
                    'thumbnail': video['thumbnail_url'],
                    'duration': video['duration'],
                    'comments': formatted_comments
                }
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps(result)
                }
            else:
                cursor.execute('''
                    SELECT v.*, c.name as channel_name, c.avatar_url as channel_avatar
                    FROM videos v
                    JOIN channels c ON v.channel_id = c.id
                    ORDER BY v.created_at DESC
                ''')
                videos = cursor.fetchall()
                
                result = [{
                    'id': str(v['id']),
                    'title': v['title'],
                    'channel': v['channel_name'],
                    'views': format_views(v['views_count']),
                    'time': format_time_ago(v['created_at']),
                    'thumbnail': v['thumbnail_url'],
                    'avatar': v['channel_avatar'],
                    'duration': v['duration']
                } for v in videos]
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps(result)
                }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            action = body_data.get('action')
            
            if action == 'create_video':
                cursor.execute('''
                    INSERT INTO videos (title, description, channel_id, thumbnail_url, category, duration)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    RETURNING id
                ''', (
                    body_data['title'],
                    body_data.get('description', ''),
                    body_data.get('channel_id', 1),
                    body_data.get('thumbnail_url', '/placeholder.svg'),
                    body_data.get('category', 'education'),
                    body_data.get('duration', '00:00')
                ))
                video_id = cursor.fetchone()['id']
                conn.commit()
                
                return {
                    'statusCode': 201,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'id': video_id, 'message': 'Video created successfully'})
                }
            
            elif action == 'add_comment':
                video_id = body_data['video_id']
                parent_id = body_data.get('parent_comment_id')
                
                cursor.execute('''
                    INSERT INTO comments (video_id, parent_comment_id, author_name, author_avatar, text)
                    VALUES (%s, %s, %s, %s, %s)
                    RETURNING id, created_at
                ''', (
                    video_id,
                    parent_id,
                    body_data.get('author_name', 'Вы'),
                    body_data.get('author_avatar', '/placeholder.svg'),
                    body_data['text']
                ))
                comment = cursor.fetchone()
                conn.commit()
                
                result = {
                    'id': str(comment['id']),
                    'author': body_data.get('author_name', 'Вы'),
                    'avatar': body_data.get('author_avatar', '/placeholder.svg'),
                    'text': body_data['text'],
                    'likes': 0,
                    'time': 'только что',
                    'replies': []
                }
                
                return {
                    'statusCode': 201,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps(result)
                }
            
            elif action == 'like_comment':
                comment_id = body_data['comment_id']
                cursor.execute('''
                    UPDATE comments SET likes_count = likes_count + 1 
                    WHERE id = %s
                    RETURNING likes_count
                ''', (comment_id,))
                result = cursor.fetchone()
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'likes': result['likes_count']})
                }
        
        elif method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            video_id = body_data['video_id']
            
            cursor.execute('''
                UPDATE videos SET views_count = views_count + 1 
                WHERE id = %s
            ''', (video_id,))
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'message': 'View counted'})
            }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Method not allowed'})
        }
        
    finally:
        cursor.close()
        conn.close()
