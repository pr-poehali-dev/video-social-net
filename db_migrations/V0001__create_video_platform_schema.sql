-- Create channels table
CREATE TABLE IF NOT EXISTS channels (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    subscribers_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create videos table
CREATE TABLE IF NOT EXISTS videos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    channel_id INTEGER REFERENCES channels(id),
    thumbnail_url TEXT,
    video_url TEXT,
    duration VARCHAR(10),
    views_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    video_id INTEGER REFERENCES videos(id),
    parent_comment_id INTEGER REFERENCES comments(id),
    author_name VARCHAR(255) NOT NULL,
    author_avatar TEXT,
    text TEXT NOT NULL,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_videos_channel_id ON videos(channel_id);
CREATE INDEX IF NOT EXISTS idx_videos_created_at ON videos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_video_id ON comments(video_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_comment_id);

-- Insert sample data
INSERT INTO channels (name, avatar_url, subscribers_count) VALUES
    ('WebDev Pro', '/placeholder.svg', 1200000),
    ('Tech Review', '/placeholder.svg', 856000),
    ('Code Masters', '/placeholder.svg', 2100000),
    ('Dev Academy', '/placeholder.svg', 654000),
    ('UX/UI School', '/placeholder.svg', 423000);

INSERT INTO videos (title, description, channel_id, thumbnail_url, duration, views_count, likes_count, category, created_at) VALUES
    ('Создание React приложений с нуля', 'Полное руководство по созданию современных React приложений', 1, '/placeholder.svg', '15:24', 1200000, 45000, 'education', NOW() - INTERVAL '2 days'),
    ('Топ 10 трендов веб-разработки 2024', 'Обзор самых актуальных трендов в веб-разработке', 2, '/placeholder.svg', '22:15', 856000, 32000, 'tech', NOW() - INTERVAL '7 days'),
    ('Как стать frontend разработчиком', 'Пошаговый план для начинающих разработчиков', 3, '/placeholder.svg', '18:47', 2100000, 78000, 'education', NOW() - INTERVAL '3 days'),
    ('TypeScript полное руководство', 'Изучаем TypeScript от основ до продвинутых техник', 4, '/placeholder.svg', '31:08', 654000, 28000, 'education', NOW() - INTERVAL '5 days'),
    ('Дизайн систем в 2024', 'Как создавать масштабируемые дизайн системы', 5, '/placeholder.svg', '12:33', 423000, 19000, 'tech', NOW() - INTERVAL '1 day'),
    ('Оптимизация производительности React', 'Техники оптимизации React приложений', 1, '/placeholder.svg', '25:19', 987000, 41000, 'education', NOW() - INTERVAL '4 days');

INSERT INTO comments (video_id, parent_comment_id, author_name, author_avatar, text, likes_count, created_at) VALUES
    (1, NULL, 'Иван Петров', '/placeholder.svg', 'Отличное видео! Очень полезная информация', 142, NOW() - INTERVAL '2 days'),
    (1, 1, 'Мария Сидорова', '/placeholder.svg', 'Согласна, автор молодец!', 23, NOW() - INTERVAL '1 day'),
    (1, NULL, 'Алексей Иванов', '/placeholder.svg', 'Можно подробнее рассказать про этот момент?', 87, NOW() - INTERVAL '1 day');