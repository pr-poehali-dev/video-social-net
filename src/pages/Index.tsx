import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
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
  description?: string;
  channelAvatar?: string;
  subscribersCount?: string;
  likes?: string;
}

interface Comment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  likes: number;
  time: string;
  replies: Comment[];
}

const API_URL = 'https://functions.poehali.dev/a7b30a67-7666-4e65-b314-d5c1a8964720';



const Index = () => {
  const [activeSection, setActiveSection] = useState<Section>('home');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setVideos(data);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

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
    return <VideoPlayer video={selectedVideo} onBack={() => setSelectedVideo(null)} videos={videos} />;
  }

  if (activeSection === 'upload') {
    return <UploadSection onBack={() => setActiveSection('home')} />;
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

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Icon name="Loader2" size={48} className="animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {videos.map((video) => (
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
        )}
      </main>
    </div>
  );
};

interface VideoPlayerProps {
  video: Video;
  onBack: () => void;
  videos: Video[];
}

const VideoPlayer = ({ video, onBack, videos }: VideoPlayerProps) => {
  const [videoData, setVideoData] = useState<any>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    fetchVideoData();
  }, [video.id]);

  const fetchVideoData = async () => {
    try {
      const response = await fetch(`${API_URL}?video_id=${video.id}`);
      const data = await response.json();
      setVideoData(data);
      setComments(data.comments || []);
    } catch (error) {
      console.error('Error fetching video:', error);
    } finally {
      setLoading(false);
    }
  };

  const addComment = async () => {
    if (newComment.trim()) {
      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'add_comment',
            video_id: video.id,
            text: newComment
          })
        });
        const newCommentData = await response.json();
        setComments([newCommentData, ...comments]);
        setNewComment('');
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    }
  };

  const addReply = async (commentId: string) => {
    if (replyText.trim()) {
      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'add_comment',
            video_id: video.id,
            parent_comment_id: commentId,
            text: replyText
          })
        });
        const newReply = await response.json();
        
        setComments(comments.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              replies: [...comment.replies, newReply]
            };
          }
          return comment;
        }));
        setReplyText('');
        setReplyTo(null);
      } catch (error) {
        console.error('Error adding reply:', error);
      }
    }
  };

  if (loading || !videoData) {
    return (
      <div className=\"min-h-screen bg-background flex items-center justify-center\">
        <Icon name=\"Loader2\" size={48} className=\"animate-spin text-muted-foreground\" />
      </div>
    );
  }

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

            <h1 className="text-2xl font-bold mb-3">{videoData.title}</h1>

            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
              <div className="flex items-center gap-4">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={videoData.channelAvatar} />
                  <AvatarFallback>{videoData.channel[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{videoData.channel}</p>
                  <p className="text-sm text-muted-foreground">{videoData.subscribersCount} подписчиков</p>
                </div>
                <Button className="ml-4 bg-primary text-primary-foreground hover:bg-primary/90">
                  Подписаться
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm">
                  <Icon name="ThumbsUp" size={18} className="mr-2" />
                  {videoData.likes}
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
              {videos.slice(0, 4).filter(v => v.id !== video.id).map((v) => (
                <div key={v.id} className="flex gap-2 cursor-pointer group" onClick={onBack}>
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

const UploadSection = ({ onBack }: { onBack: () => void }) => {
  const { toast } = useToast();
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [uploadData, setUploadData] = useState({
    title: '',
    description: '',
    category: 'education'
  });

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnailFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!videoFile) {
      toast({
        title: "Ошибка",
        description: "Выберите видеофайл для загрузки",
        variant: "destructive"
      });
      return;
    }

    if (!uploadData.title.trim()) {
      toast({
        title: "Ошибка",
        description: "Введите название видео",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_video',
          title: uploadData.title,
          description: uploadData.description,
          category: uploadData.category,
          channel_id: 1
        })
      });

      const result = await response.json();

      toast({
        title: "Видео загружено!",
        description: `"${uploadData.title}" успешно опубликовано`,
      });

      setTimeout(() => {
        onBack();
      }, 1500);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить видео",
        variant: "destructive"
      });
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

      <main className="mt-14 max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-2">Загрузка видео</h1>
        <p className="text-muted-foreground mb-8">Поделитесь своим контентом с миллионами зрителей</p>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Информация о видео</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Название *</Label>
                    <Input
                      id="title"
                      placeholder="Добавьте название, которое описывает ваше видео"
                      value={uploadData.title}
                      onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                      className="mt-2"
                      maxLength={100}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {uploadData.title.length}/100
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="description">Описание</Label>
                    <Textarea
                      id="description"
                      placeholder="Расскажите зрителям о своём видео"
                      value={uploadData.description}
                      onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                      className="mt-2 min-h-32"
                      maxLength={5000}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {uploadData.description.length}/5000
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="category">Категория</Label>
                    <select
                      id="category"
                      value={uploadData.category}
                      onChange={(e) => setUploadData({ ...uploadData, category: e.target.value })}
                      className="w-full mt-2 h-10 px-3 rounded-md border border-border bg-background"
                    >
                      <option value="education">Образование</option>
                      <option value="entertainment">Развлечения</option>
                      <option value="gaming">Игры</option>
                      <option value="music">Музыка</option>
                      <option value="tech">Технологии</option>
                      <option value="sport">Спорт</option>
                      <option value="news">Новости</option>
                      <option value="blog">Блог</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Обложка видео</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-secondary transition-colors">
                    <input
                      type="file"
                      id="thumbnail"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                      className="hidden"
                    />
                    <label htmlFor="thumbnail" className="cursor-pointer">
                      {thumbnailFile ? (
                        <div className="space-y-2">
                          <Icon name="Image" size={48} className="mx-auto text-secondary" />
                          <p className="font-medium">{thumbnailFile.name}</p>
                          <p className="text-sm text-muted-foreground">Нажмите для изменения</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Icon name="Image" size={48} className="mx-auto text-muted-foreground" />
                          <p className="font-medium">Загрузите обложку</p>
                          <p className="text-sm text-muted-foreground">
                            Рекомендуем изображение 1280x720
                          </p>
                        </div>
                      )}
                    </label>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Видеофайл</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-secondary transition-colors">
                    <input
                      type="file"
                      id="video"
                      accept="video/*"
                      onChange={handleVideoChange}
                      className="hidden"
                    />
                    <label htmlFor="video" className="cursor-pointer">
                      {videoFile ? (
                        <div className="space-y-2">
                          <Icon name="Video" size={48} className="mx-auto text-secondary" />
                          <p className="font-medium text-sm">{videoFile.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(videoFile.size / (1024 * 1024)).toFixed(2)} МБ
                          </p>
                          <p className="text-xs text-muted-foreground">Нажмите для изменения</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Icon name="Upload" size={48} className="mx-auto text-muted-foreground" />
                          <p className="font-medium">Выберите файл</p>
                          <p className="text-xs text-muted-foreground">или перетащите сюда</p>
                        </div>
                      )}
                    </label>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-accent/50">
                <CardContent className="pt-6">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <Icon name="Info" size={16} className="text-secondary mt-0.5 flex-shrink-0" />
                      <p className="text-muted-foreground">
                        Ваше видео будет обработано после загрузки
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Icon name="Clock" size={16} className="text-secondary mt-0.5 flex-shrink-0" />
                      <p className="text-muted-foreground">
                        Обработка может занять несколько минут
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Icon name="Shield" size={16} className="text-secondary mt-0.5 flex-shrink-0" />
                      <p className="text-muted-foreground">
                        Следите за соблюдением авторских прав
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button 
                type="submit" 
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                size="lg"
              >
                <Icon name="Upload" size={20} className="mr-2" />
                Опубликовать видео
              </Button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Index;