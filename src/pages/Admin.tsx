import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const BACKEND_SERVERS_URL = 'https://functions.poehali.dev/1ad46246-e34a-468e-a501-543585eff4aa';

const Admin = () => {
  const [servers, setServers] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    city: '',
    ip_address: '',
    port: '51820',
    latitude: '',
    longitude: '',
    config_type: 'amnezia',
    config_data: '',
    ssh_host: '',
    ssh_port: '22',
    ssh_user: '',
    ping_ms: '',
    bandwidth_mbps: '',
    max_users: '100'
  });

  useEffect(() => {
    loadServers();
  }, []);

  const loadServers = async () => {
    try {
      const response = await fetch(`${BACKEND_SERVERS_URL}?active=false`);
      const data = await response.json();
      setServers(data.servers || []);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить серверы',
        variant: 'destructive'
      });
    }
  };

  const handleAddServer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(BACKEND_SERVERS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          port: parseInt(formData.port),
          ssh_port: parseInt(formData.ssh_port),
          latitude: formData.latitude ? parseFloat(formData.latitude) : null,
          longitude: formData.longitude ? parseFloat(formData.longitude) : null,
          ping_ms: formData.ping_ms ? parseInt(formData.ping_ms) : null,
          bandwidth_mbps: formData.bandwidth_mbps ? parseInt(formData.bandwidth_mbps) : null,
          max_users: parseInt(formData.max_users)
        })
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: 'Успешно!',
          description: `Сервер ${data.server.name} добавлен`
        });
        
        setFormData({
          name: '',
          country: '',
          city: '',
          ip_address: '',
          port: '51820',
          latitude: '',
          longitude: '',
          config_type: 'amnezia',
          config_data: '',
          ssh_host: '',
          ssh_port: '22',
          ssh_user: '',
          ping_ms: '',
          bandwidth_mbps: '',
          max_users: '100'
        });
        
        setShowAddForm(false);
        loadServers();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось добавить сервер',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteServer = async (serverId: number) => {
    try {
      await fetch(`${BACKEND_SERVERS_URL}?id=${serverId}`, {
        method: 'DELETE'
      });
      
      toast({
        title: 'Удалено',
        description: 'Сервер деактивирован'
      });
      
      loadServers();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить сервер',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="gradient-primary h-64 absolute top-0 left-0 right-0 opacity-20 blur-3xl"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-6 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <div className="gradient-primary p-2 rounded-xl">
              <Icon name="ServerCog" className="text-white" size={24} />
            </div>
            Управление серверами
          </h1>
          <Button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="gradient-primary"
          >
            <Icon name="Plus" size={20} className="mr-2" />
            Добавить сервер
          </Button>
        </div>

        {showAddForm && (
          <Card className="p-6 mb-6 bg-card border-border">
            <h2 className="text-xl font-semibold mb-4">Новый сервер</h2>
            <form onSubmit={handleAddServer} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Название *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Amsterdam VPS"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="country">Страна *</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                    placeholder="Netherlands"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="city">Город</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    placeholder="Amsterdam"
                  />
                </div>

                <div>
                  <Label htmlFor="ip_address">IP адрес *</Label>
                  <Input
                    id="ip_address"
                    value={formData.ip_address}
                    onChange={(e) => setFormData({...formData, ip_address: e.target.value})}
                    placeholder="45.67.89.123"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="port">Порт</Label>
                  <Input
                    id="port"
                    type="number"
                    value={formData.port}
                    onChange={(e) => setFormData({...formData, port: e.target.value})}
                    placeholder="51820"
                  />
                </div>

                <div>
                  <Label htmlFor="config_type">Тип конфигурации</Label>
                  <Input
                    id="config_type"
                    value={formData.config_type}
                    onChange={(e) => setFormData({...formData, config_type: e.target.value})}
                    placeholder="amnezia"
                  />
                </div>

                <div>
                  <Label htmlFor="latitude">Широта</Label>
                  <Input
                    id="latitude"
                    value={formData.latitude}
                    onChange={(e) => setFormData({...formData, latitude: e.target.value})}
                    placeholder="52.3676"
                  />
                </div>

                <div>
                  <Label htmlFor="longitude">Долгота</Label>
                  <Input
                    id="longitude"
                    value={formData.longitude}
                    onChange={(e) => setFormData({...formData, longitude: e.target.value})}
                    placeholder="4.9041"
                  />
                </div>

                <div>
                  <Label htmlFor="ping_ms">Ping (мс)</Label>
                  <Input
                    id="ping_ms"
                    type="number"
                    value={formData.ping_ms}
                    onChange={(e) => setFormData({...formData, ping_ms: e.target.value})}
                    placeholder="15"
                  />
                </div>

                <div>
                  <Label htmlFor="bandwidth_mbps">Скорость (Мбит/с)</Label>
                  <Input
                    id="bandwidth_mbps"
                    type="number"
                    value={formData.bandwidth_mbps}
                    onChange={(e) => setFormData({...formData, bandwidth_mbps: e.target.value})}
                    placeholder="1000"
                  />
                </div>

                <div>
                  <Label htmlFor="max_users">Макс. пользователей</Label>
                  <Input
                    id="max_users"
                    type="number"
                    value={formData.max_users}
                    onChange={(e) => setFormData({...formData, max_users: e.target.value})}
                    placeholder="100"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="config_data">Конфигурация Amnezia *</Label>
                <Textarea
                  id="config_data"
                  value={formData.config_data}
                  onChange={(e) => setFormData({...formData, config_data: e.target.value})}
                  placeholder="[Interface]&#10;PrivateKey=...&#10;Address=10.0.0.1/24"
                  rows={6}
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Вставьте содержимое .conf файла или SSH данные
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="ssh_host">SSH Host (опц.)</Label>
                  <Input
                    id="ssh_host"
                    value={formData.ssh_host}
                    onChange={(e) => setFormData({...formData, ssh_host: e.target.value})}
                    placeholder="45.67.89.123"
                  />
                </div>

                <div>
                  <Label htmlFor="ssh_port">SSH Port</Label>
                  <Input
                    id="ssh_port"
                    type="number"
                    value={formData.ssh_port}
                    onChange={(e) => setFormData({...formData, ssh_port: e.target.value})}
                    placeholder="22"
                  />
                </div>

                <div>
                  <Label htmlFor="ssh_user">SSH User</Label>
                  <Input
                    id="ssh_user"
                    value={formData.ssh_user}
                    onChange={(e) => setFormData({...formData, ssh_user: e.target.value})}
                    placeholder="root"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="submit" className="gradient-primary">
                  <Icon name="Save" size={18} className="mr-2" />
                  Сохранить сервер
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                >
                  Отмена
                </Button>
              </div>
            </form>
          </Card>
        )}

        <div className="space-y-4">
          {servers.length === 0 && (
            <Card className="p-8 text-center bg-card border-border">
              <Icon name="Server" size={48} className="mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Нет серверов</h3>
              <p className="text-muted-foreground">Добавьте первый VPN сервер</p>
            </Card>
          )}

          {servers.map((server) => (
            <Card key={server.id} className="p-6 bg-card border-border">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                      <Icon name="Server" size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{server.name}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Icon name="MapPin" size={14} />
                        {server.city ? `${server.city}, ` : ''}{server.country}
                      </p>
                    </div>
                    {server.is_active ? (
                      <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium">
                        Активен
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-medium">
                        Отключен
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground">IP адрес</p>
                      <p className="font-mono text-sm">{server.ip_address}:{server.port}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Ping</p>
                      <p className="font-semibold">{server.ping_ms ? `${server.ping_ms} мс` : '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Скорость</p>
                      <p className="font-semibold">{server.bandwidth_mbps ? `${server.bandwidth_mbps} Мбит/с` : '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Загрузка</p>
                      <p className="font-semibold">{server.current_users}/{server.max_users}</p>
                    </div>
                  </div>

                  <details className="text-xs">
                    <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                      Показать конфигурацию
                    </summary>
                    <pre className="mt-2 p-3 bg-muted rounded-lg overflow-x-auto">
                      {server.config_data}
                    </pre>
                  </details>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteServer(server.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Icon name="Trash2" size={20} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;
