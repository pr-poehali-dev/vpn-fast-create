import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [currentTab, setCurrentTab] = useState('connection');
  const [downloadSpeed, setDownloadSpeed] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState(0);

  const apps = [
    { name: 'Chrome', icon: 'Globe', enabled: true },
    { name: 'Telegram', icon: 'MessageSquare', enabled: true },
    { name: 'YouTube', icon: 'Video', enabled: false },
    { name: 'Discord', icon: 'MessageCircle', enabled: true },
    { name: 'Steam', icon: 'Gamepad2', enabled: false },
    { name: 'Spotify', icon: 'Music', enabled: false },
  ];

  const handleConnect = () => {
    setIsConnected(!isConnected);
    if (!isConnected) {
      setTimeout(() => {
        setDownloadSpeed(Math.floor(Math.random() * 50) + 50);
        setUploadSpeed(Math.floor(Math.random() * 20) + 30);
      }, 1500);
    } else {
      setDownloadSpeed(0);
      setUploadSpeed(0);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="gradient-primary h-64 absolute top-0 left-0 right-0 opacity-20 blur-3xl"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-6 max-w-md">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <div className="gradient-primary p-2 rounded-xl">
              <Icon name="Shield" className="text-white" size={24} />
            </div>
            VPN Guard
          </h1>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Icon name="Bell" size={20} />
          </Button>
        </div>

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6 bg-card">
            <TabsTrigger value="connection" className="data-[state=active]:gradient-primary data-[state=active]:text-white">
              <Icon name="Wifi" size={18} />
            </TabsTrigger>
            <TabsTrigger value="apps" className="data-[state=active]:gradient-primary data-[state=active]:text-white">
              <Icon name="AppWindow" size={18} />
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:gradient-primary data-[state=active]:text-white">
              <Icon name="User" size={18} />
            </TabsTrigger>
            <TabsTrigger value="support" className="data-[state=active]:gradient-primary data-[state=active]:text-white">
              <Icon name="MessageCircleQuestion" size={18} />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="connection" className="space-y-6">
            <Card className="p-8 text-center bg-card border-border relative overflow-hidden">
              <div className="absolute inset-0 gradient-primary opacity-10"></div>
              <div className="relative z-10">
                <div 
                  className={`w-32 h-32 mx-auto rounded-full gradient-primary flex items-center justify-center mb-6 transition-all duration-500 ${
                    isConnected ? 'animate-pulse-slow shadow-2xl shadow-primary/50' : ''
                  }`}
                  onClick={handleConnect}
                  style={{ cursor: 'pointer' }}
                >
                  <Icon 
                    name={isConnected ? "ShieldCheck" : "Shield"} 
                    size={64} 
                    className="text-white"
                  />
                </div>
                
                <h2 className="text-2xl font-bold mb-2">
                  {isConnected ? 'Подключено' : 'Не подключено'}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {isConnected ? 'Ваше соединение защищено' : 'Нажмите для подключения'}
                </p>

                <Button 
                  onClick={handleConnect}
                  className={`w-full text-lg py-6 rounded-xl transition-all duration-300 ${
                    isConnected 
                      ? 'bg-destructive hover:bg-destructive/90' 
                      : 'gradient-primary hover:opacity-90'
                  }`}
                >
                  {isConnected ? 'Отключиться' : 'Подключиться'}
                </Button>
              </div>
            </Card>

            {isConnected && (
              <Card className="p-6 bg-card border-border animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Icon name="Gauge" size={20} className="text-primary" />
                  Скорость соединения
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Icon name="Download" size={16} />
                        Загрузка
                      </span>
                      <span className="text-sm font-semibold">{downloadSpeed} Мбит/с</span>
                    </div>
                    <Progress value={downloadSpeed} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Icon name="Upload" size={16} />
                        Отдача
                      </span>
                      <span className="text-sm font-semibold">{uploadSpeed} Мбит/с</span>
                    </div>
                    <Progress value={uploadSpeed} className="h-2" />
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-xs text-muted-foreground">Сервер</p>
                    <p className="font-semibold flex items-center justify-center gap-1">
                      <Icon name="MapPin" size={14} />
                      Нидерланды
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Ping</p>
                    <p className="font-semibold">12 мс</p>
                  </div>
                </div>
              </Card>
            )}

            <Card className="p-6 bg-card border-border">
              <Button variant="outline" className="w-full justify-between">
                <span className="flex items-center gap-2">
                  <Icon name="Activity" size={20} />
                  Тест скорости интернета
                </span>
                <Icon name="ChevronRight" size={20} />
              </Button>
            </Card>
          </TabsContent>

          <TabsContent value="apps" className="space-y-4">
            <Card className="p-6 bg-card border-border">
              <h3 className="font-semibold mb-4">Управление приложениями</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Выберите приложения, которые будут использовать VPN
              </p>

              <div className="space-y-3">
                {apps.map((app, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                        <Icon name={app.icon as any} size={20} className="text-white" />
                      </div>
                      <span className="font-medium">{app.name}</span>
                    </div>
                    <Switch defaultChecked={app.enabled} />
                  </div>
                ))}
              </div>

              <Button variant="outline" className="w-full mt-6">
                <Icon name="Plus" size={20} className="mr-2" />
                Добавить приложение
              </Button>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <Card className="p-6 bg-card border-border text-center">
              <div className="w-24 h-24 rounded-full gradient-accent mx-auto mb-4 flex items-center justify-center text-4xl font-bold text-white">
                У
              </div>
              <h3 className="text-xl font-bold mb-1">Пользователь</h3>
              <p className="text-sm text-muted-foreground mb-4">user@example.com</p>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">24</p>
                  <p className="text-xs text-muted-foreground mt-1">Дней подписки</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">145</p>
                  <p className="text-xs text-muted-foreground mt-1">ГБ передано</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card border-border space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Icon name="Settings" size={20} className="mr-2" />
                Настройки
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Icon name="CreditCard" size={20} className="mr-2" />
                Подписка
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Icon name="LogOut" size={20} className="mr-2" />
                Выйти
              </Button>
            </Card>
          </TabsContent>

          <TabsContent value="support" className="space-y-4">
            <Card className="p-6 bg-card border-border">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Icon name="MessageCircleQuestion" size={20} className="text-primary" />
                Поддержка
              </h3>
              
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-between">
                  <span className="flex items-center gap-2">
                    <Icon name="BookOpen" size={20} />
                    База знаний
                  </span>
                  <Icon name="ChevronRight" size={20} />
                </Button>
                
                <Button variant="outline" className="w-full justify-between">
                  <span className="flex items-center gap-2">
                    <Icon name="Mail" size={20} />
                    Написать в поддержку
                  </span>
                  <Icon name="ChevronRight" size={20} />
                </Button>
                
                <Button variant="outline" className="w-full justify-between">
                  <span className="flex items-center gap-2">
                    <Icon name="MessageCircle" size={20} />
                    Онлайн-чат
                  </span>
                  <span className="px-2 py-1 rounded-full bg-green-500 text-xs text-white">
                    Онлайн
                  </span>
                </Button>
              </div>
            </Card>

            <Card className="p-6 bg-card border-border">
              <h3 className="font-semibold mb-4">Часто задаваемые вопросы</h3>
              
              <div className="space-y-3">
                {[
                  'Как настроить VPN для конкретного приложения?',
                  'Почему скорость интернета снизилась?',
                  'Как выбрать другой сервер?',
                ].map((question, index) => (
                  <button
                    key={index}
                    className="w-full text-left p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-sm"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
