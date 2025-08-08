import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Database, Settings, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface DatabaseConfig {
  type: 'mysql' | 'postgresql' | 'neon' | 'supabase' | 'aiven';
  connectionString: string;
  isConnected: boolean;
  lastChecked: string;
}

interface SystemInfo {
  nodeVersion: string;
  environment: string;
  uptime: string;
  memoryUsage: {
    used: number;
    total: number;
  };
}

export default function AdminPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedDbType, setSelectedDbType] = useState<string>('postgresql');
  const [connectionString, setConnectionString] = useState('');

  const { data: dbConfig, isLoading: dbLoading } = useQuery({
    queryKey: ['/api/admin/database'],
  });

  const { data: systemInfo, isLoading: systemLoading } = useQuery({
    queryKey: ['/api/admin/system'],
  });

  const testConnectionMutation = useMutation({
    mutationFn: async (config: { type: string; connectionString: string }) => {
      const response = await fetch('/api/admin/database/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      return response.json();
    },
    onSuccess: (result: any) => {
      toast({
        title: 'Connection Test',
        description: result.success ? 'Database connection successful!' : 'Connection failed: ' + result.error,
        variant: result.success ? 'default' : 'destructive',
      });
    },
  });

  const updateConfigMutation = useMutation({
    mutationFn: async (config: { type: string; connectionString: string }) => {
      const response = await fetch('/api/admin/database/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Database Updated',
        description: 'Database configuration has been updated successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/database'] });
    },
  });

  const handleTestConnection = () => {
    if (!connectionString.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a connection string',
        variant: 'destructive',
      });
      return;
    }
    testConnectionMutation.mutate({ type: selectedDbType, connectionString });
  };

  const handleUpdateConfig = () => {
    if (!connectionString.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a connection string',
        variant: 'destructive',
      });
      return;
    }
    updateConfigMutation.mutate({ type: selectedDbType, connectionString });
  };

  const getDatabaseStatusBadge = (isConnected: boolean) => {
    return (
      <Badge variant={isConnected ? 'default' : 'destructive'} className="flex items-center gap-1">
        {isConnected ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
        {isConnected ? 'Connected' : 'Disconnected'}
      </Badge>
    );
  };

  const getConnectionStringTemplate = (type: string) => {
    const templates = {
      postgresql: 'postgresql://username:password@localhost:5432/curhatin_db',
      mysql: 'mysql://username:password@localhost:3306/curhatin_db',
      neon: 'postgresql://username:password@ep-xxx-xxx.us-east-1.aws.neon.tech/neondb',
      supabase: 'postgresql://postgres.xxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres',
      aiven: 'mysql://username:password@mysql-xxx.aivencloud.com:port/defaultdb',
    };
    return templates[type as keyof typeof templates] || '';
  };

  useEffect(() => {
    if (dbConfig?.type) {
      setSelectedDbType(dbConfig.type);
      setConnectionString(dbConfig.connectionString === '***configured***' ? '' : dbConfig.connectionString || '');
    }
  }, [dbConfig]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-8 h-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-gray-600">Manage system settings and database configuration</p>
        </div>
      </div>

      <Tabs defaultValue="database" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="database">Database Settings</TabsTrigger>
          <TabsTrigger value="system">System Information</TabsTrigger>
        </TabsList>

        <TabsContent value="database" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Database Configuration
              </CardTitle>
              <CardDescription>
                Configure your database connection. CURHATIN supports multiple database providers.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {dbLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              ) : (
                <>
                  {dbConfig && (
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium">Current Configuration</h3>
                        <p className="text-sm text-gray-600">
                          Type: {dbConfig.type} | Last checked: {dbConfig.lastChecked ? new Date(dbConfig.lastChecked).toLocaleString() : 'Never'}
                        </p>
                      </div>
                      {getDatabaseStatusBadge(dbConfig?.isConnected || false)}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="db-type">Database Type</Label>
                      <Select value={selectedDbType} onValueChange={setSelectedDbType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select database type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="postgresql">Localhost PostgreSQL</SelectItem>
                          <SelectItem value="mysql">Localhost MySQL</SelectItem>
                          <SelectItem value="neon">NeonDB (PostgreSQL)</SelectItem>
                          <SelectItem value="supabase">Supabase (PostgreSQL)</SelectItem>
                          <SelectItem value="aiven">Aiven MySQL</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="connection-string">Connection String</Label>
                      <Input
                        id="connection-string"
                        type="password"
                        placeholder={getConnectionStringTemplate(selectedDbType)}
                        value={connectionString}
                        onChange={(e) => setConnectionString(e.target.value)}
                        className="font-mono text-sm"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Template: {getConnectionStringTemplate(selectedDbType)}
                      </p>
                    </div>

                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Security Note:</strong> Connection strings contain sensitive information. 
                        They are securely stored and never displayed in plain text.
                      </AlertDescription>
                    </Alert>

                    <div className="flex gap-3">
                      <Button
                        onClick={handleTestConnection}
                        disabled={testConnectionMutation.isPending}
                        variant="outline"
                      >
                        {testConnectionMutation.isPending ? 'Testing...' : 'Test Connection'}
                      </Button>
                      <Button
                        onClick={handleUpdateConfig}
                        disabled={updateConfigMutation.isPending}
                      >
                        {updateConfigMutation.isPending ? 'Updating...' : 'Update Configuration'}
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Database Setup Guide</CardTitle>
              <CardDescription>
                Step-by-step instructions for different database providers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-medium">Cloud Providers</h4>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• <strong>NeonDB:</strong> Create project → Copy connection string</li>
                    <li>• <strong>Supabase:</strong> Settings → Database → Connection string</li>
                    <li>• <strong>Aiven:</strong> Service overview → Connection info</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Local Setup</h4>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• <strong>PostgreSQL:</strong> Install locally, create database</li>
                    <li>• <strong>MySQL:</strong> Install locally, set DB_TYPE=mysql</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
              <CardDescription>
                Current system status and performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              {systemLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              ) : systemInfo ? (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">Node.js Version</Label>
                      <p className="text-sm text-gray-600">{systemInfo?.nodeVersion || 'Unknown'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Environment</Label>
                      <Badge variant="outline">{systemInfo?.environment || 'Unknown'}</Badge>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Uptime</Label>
                      <p className="text-sm text-gray-600">{systemInfo?.uptime || 'Unknown'}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">Memory Usage</Label>
                      <div className="mt-2">
                        <div className="flex justify-between text-sm">
                          <span>Used: {systemInfo?.memoryUsage?.used || 0}MB</span>
                          <span>Total: {systemInfo?.memoryUsage?.total || 0}MB</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width: `${systemInfo?.memoryUsage ? (systemInfo.memoryUsage.used / systemInfo.memoryUsage.total) * 100 : 0}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Unable to load system information</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}