import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

type Section = 'home' | 'recommended' | 'subscriptions' | 'trending' | 'history' | 'playlists' | 'upload';

interface Video {
  id: string;
  title: string;
  channel: string;
  views: string;
  time: string;
  thumbnail: string;
  avatar: string;
  duration: string;
}

const mockVideos: Video[] = [
  {
    id: '1',
    title: 'Создание React приложений с нуля',
    channel: 'WebDev Pro',
    views: '1.2M',
    time: '2 дня назад',
    thumbnail: '/placeholder.svg',
    avatar: '/placeholder.svg',
    duration: '15:24'
  },
  {
    id: '2',
    title: 'Топ 10 трендов веб-разработки 2024',
    channel: 'Tech Review',
    views: '856K',
    time: '1 неделю назад',
    thumbnail: '/placeholder.svg',
    avatar: '/placeholder.svg',
    duration: '22:15'
  },
  {
    id: '3',
    title: 'Как стать frontend разработчиком',
    channel: 'Code Masters',
    views: '2.1M',
    time: '3 дня назад',
    thumbnail: '/placeholder.svg',
    avatar: '/placeholder.svg',
    duration: '18:47'
  },
  {
    id: '4',
    title: 'TypeScript полное руководство',
    channel: 'Dev Academy',
    views: '654K',
    time: '5 дней назад',
    thumbnail: '/placeholder.svg',
    avatar: '/placeholder.svg',
    duration: '31:08'
  },
  {
    id: '5',
    title: 'Дизайн систем в 2024',
    channel: 'UX/UI School',
    views: '423K',
    time: '1 день назад',
    thumbnail: '/placeholder.svg',
    avatar: '/placeholder.svg',
    duration: '12:33'
  },
  {
    id: '6',
    title: 'Оптимизация производительности React',
    channel: 'WebDev Pro',
    views: '987K',
    time: '4 дня назад',
    thumbnail: '/placeholder.svg',
    avatar: '/placeholder.svg',
    duration: '25:19'
  }
];

const Index = () => {
  const [activeSection, setActiveSection] = useState<Section>('home');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const sidebarItems = [
    { id: 'home' as Section, label: 'Главная', icon: 'Home' },
    { id: 'recommended' as Section, label: 'Рекомендации', icon: 'Sparkles' },
    { id: 'subscriptions' as Section, label: 'Подписки', icon: 'Users' },
    { id: 'trending' as Section, label: 'Тренды', icon: 'TrendingUp' },
    { id: 'history' as Section, label: 'История', icon: 'History' },
    { id: 'playlists' as Section, label: 'Плейлисты', icon: 'List' },
    { id: 'upload' as Section, label: 'Загрузка', icon: 'Upload' }
  ];

  if (selectedVideo) {
    return <VideoPlayer video={selectedVideo} onBack={() => setSelectedVideo(null)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 h-14 bg-background border-b border-border flex items-center px-4 z-50">
        <div className="flex items-center gap-4 flex-1">
          <Button variant="ghost" size="icon">
            <Icon name="Menu" size={24} />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Play" size={20} className="text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">VideoHub</span>
          </div>
        </div>
        
        <div className="flex-1 max-w-2xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <Input 
                placeholder="Поиск" 
                className="bg-accent border-border pl-4 pr-10"
              />
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-0 top-0 h-full"
              >
                <Icon name="Search" size={20} />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-1 justify-end">
          <Button variant="ghost" size="icon">
            <Icon name="Bell" size={20} />
          </Button>
          <Avatar className="w-8 h-8">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <aside className="fixed left-0 top-14 bottom-0 w-64 bg-background border-r border-border overflow-y-auto">
        <nav className="p-3">
          {sidebarItems.map((item) => (
            <Button
              key={item.id}
              variant={activeSection === item.id ? 'secondary' : 'ghost'}
              className="w-full justify-start mb-1"
              onClick={() => setActiveSection(item.id)}
            >
              <Icon name={item.icon as any} size={20} className="mr-3" />
              {item.label}
            </Button>
          ))}
        </nav>
      </aside>

      <main className="ml-64 mt-14 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">
            {activeSection === 'home' && 'Главная'}
            {activeSection === 'recommended' && 'Рекомендации'}
            {activeSection === 'subscriptions' && 'Подписки'}
            {activeSection === 'trending' && 'Тренды'}
            {activeSection === 'history' && 'История просмотров'}
            {activeSection === 'playlists' && 'Мои плейлисты'}
            {activeSection === 'upload' && 'Загрузка видео'}
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {mockVideos.map((video) => (
            <div
              key={video.id}
              className="cursor-pointer group"
              onClick={() => setSelectedVideo(video)}
            >
              <div className="relative mb-3 rounded-xl overflow-hidden bg-accent">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                  {video.duration}
                </div>
              </div>
              
              <div className="flex gap-3">
                <Avatar className="w-9 h-9 flex-shrink-0">
                  <AvatarImage src={video.avatar} />
                  <AvatarFallback>{video.channel[0]}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm mb-1 line-clamp-2 group-hover:text-secondary transition-colors">
                    {video.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">{video.channel}</p>
                  <p className="text-xs text-muted-foreground">
                    {video.views} просмотров • {video.time}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

interface VideoPlayerProps {
  video: Video;
  onBack: () => void;
}

const VideoPlayer = ({ video, onBack }: VideoPlayerProps) => {
  const [comments, setComments] = useState([
    {
      id: '1',
      author: 'Иван Петров',
      avatar: '/placeholder.svg',
      text: 'Отличное видео! Очень полезная информация',
      likes: 142,
      time: '2 дня назад',
      replies: [
        {
          id: '1-1',
          author: 'Мария Сидорова',
          avatar: '/placeholder.svg',
          text: 'Согласен, автор молодец!',
          likes: 23,
          time: '1 день назад'
        }
      ]
    },
    {
      id: '2',
      author: 'Алексей Иванов',
      avatar: '/placeholder.svg',
      text: 'Можно подробнее рассказать про этот момент?',
      likes: 87,
      time: '1 день назад',
      replies: []
    }
  ]);

  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const addComment = () => {
    if (newComment.trim()) {
      setComments([
        {
          id: Date.now().toString(),
          author: 'Вы',
          avatar: '/placeholder.svg',
          text: newComment,
          likes: 0,
          time: 'только что',
          replies: []
        },
        ...comments
      ]);
      setNewComment('');
    }
  };

  const addReply = (commentId: string) => {
    if (replyText.trim()) {
      setComments(comments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: [
              ...comment.replies,
              {
                id: `${commentId}-${Date.now()}`,
                author: 'Вы',
                avatar: '/placeholder.svg',
                text: replyText,
                likes: 0,
                time: 'только что'
              }
            ]
          };
        }
        return comment;
      }));
      setReplyText('');
      setReplyTo(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 h-14 bg-background border-b border-border flex items-center px-4 z-50">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <Icon name="ArrowLeft" size={24} />
        </Button>
        <div className="flex items-center gap-2 ml-4">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Icon name="Play" size={20} className="text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">VideoHub</span>
        </div>
      </header>

      <main className="mt-14 max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-black rounded-xl overflow-hidden mb-4 aspect-video">
              <div className="w-full h-full flex items-center justify-center">
                <Icon name="Play" size={64} className="text-white/50" />
              </div>
            </div>

            <h1 className="text-2xl font-bold mb-3">{video.title}</h1>

            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
              <div className="flex items-center gap-4">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={video.avatar} />
                  <AvatarFallback>{video.channel[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{video.channel}</p>
                  <p className="text-sm text-muted-foreground">1.2M подписчиков</p>
                </div>
                <Button className="ml-4 bg-primary text-primary-foreground hover:bg-primary/90">
                  Подписаться
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm">
                  <Icon name="ThumbsUp" size={18} className="mr-2" />
                  12K
                </Button>
                <Button variant="secondary" size="sm">
                  <Icon name="Share2" size={18} className="mr-2" />
                  Поделиться
                </Button>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4">
                {comments.length} комментариев
              </h2>

              <div className="flex gap-3 mb-6">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Input
                    placeholder="Добавить комментарий..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="bg-transparent border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-secondary"
                  />
                  {newComment && (
                    <div className="flex gap-2 mt-2 justify-end">
                      <Button variant="ghost" size="sm" onClick={() => setNewComment('')}>
                        Отмена
                      </Button>
                      <Button size="sm" onClick={addComment}>
                        Отправить
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id}>
                    <div className="flex gap-3">
                      <Avatar className="w-10 h-10 flex-shrink-0">
                        <AvatarImage src={comment.avatar} />
                        <AvatarFallback>{comment.author[0]}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{comment.author}</span>
                          <span className="text-xs text-muted-foreground">{comment.time}</span>
                        </div>
                        <p className="text-sm mb-2">{comment.text}</p>
                        
                        <div className="flex items-center gap-4">
                          <Button variant="ghost" size="sm" className="h-8 px-2">
                            <Icon name="ThumbsUp" size={16} className="mr-1" />
                            <span className="text-xs">{comment.likes}</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 px-2">
                            <Icon name="ThumbsDown" size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-xs"
                            onClick={() => setReplyTo(comment.id)}
                          >
                            Ответить
                          </Button>
                        </div>

                        {replyTo === comment.id && (
                          <div className="flex gap-3 mt-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src="/placeholder.svg" />
                              <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <Input
                                placeholder="Добавить ответ..."
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                className="bg-transparent border-0 border-b border-border rounded-none px-0 text-sm focus-visible:ring-0 focus-visible:border-secondary"
                              />
                              <div className="flex gap-2 mt-2 justify-end">
                                <Button variant="ghost" size="sm" onClick={() => setReplyTo(null)}>
                                  Отмена
                                </Button>
                                <Button size="sm" onClick={() => addReply(comment.id)}>
                                  Ответить
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}

                        {comment.replies.length > 0 && (
                          <div className="mt-4 space-y-4">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="flex gap-3">
                                <Avatar className="w-8 h-8 flex-shrink-0">
                                  <AvatarImage src={reply.avatar} />
                                  <AvatarFallback>{reply.author[0]}</AvatarFallback>
                                </Avatar>
                                
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-sm">{reply.author}</span>
                                    <span className="text-xs text-muted-foreground">{reply.time}</span>
                                  </div>
                                  <p className="text-sm mb-2">{reply.text}</p>
                                  
                                  <div className="flex items-center gap-4">
                                    <Button variant="ghost" size="sm" className="h-8 px-2">
                                      <Icon name="ThumbsUp" size={16} className="mr-1" />
                                      <span className="text-xs">{reply.likes}</span>
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-8 px-2">
                                      <Icon name="ThumbsDown" size={16} />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Рекомендуемые</h2>
            <div className="space-y-3">
              {mockVideos.slice(0, 4).map((v) => (
                <div key={v.id} className="flex gap-2 cursor-pointer group" onClick={() => window.location.reload()}>
                  <div className="relative w-40 flex-shrink-0 rounded-lg overflow-hidden bg-accent">
                    <img
                      src={v.thumbnail}
                      alt={v.title}
                      className="w-full aspect-video object-cover"
                    />
                    <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
                      {v.duration}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm mb-1 line-clamp-2 group-hover:text-secondary transition-colors">
                      {v.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">{v.channel}</p>
                    <p className="text-xs text-muted-foreground">
                      {v.views} • {v.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
