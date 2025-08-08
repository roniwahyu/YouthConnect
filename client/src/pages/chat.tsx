import { useState, useEffect, useRef } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Header from "@/components/header";
import { getStoredUser } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Chat() {
  const [, setLocation] = useLocation();
  const { sessionId } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState(getStoredUser());
  const [message, setMessage] = useState("");
  const [currentSessionId, setCurrentSessionId] = useState(sessionId);

  useEffect(() => {
    if (!user) {
      setLocation("/login");
    }
  }, [user, setLocation]);

  const { data: chatSessions = [] } = useQuery({
    queryKey: ["/api/chat/sessions"],
    enabled: !!user,
    select: (data) => Array.isArray(data) ? data : [],
  });

  const { data: currentSession, isLoading } = useQuery({
    queryKey: ["/api/chat/sessions", currentSessionId],
    queryFn: async () => {
      if (!currentSessionId) return null;
      const response = await fetch(`/api/chat/sessions/${currentSessionId}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Session not found");
      return response.json();
    },
    enabled: !!currentSessionId,
  });

  const createSessionMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/chat/sessions", {
        counselorId: null,
        messages: [],
      });
      return response.json();
    },
    onSuccess: (data) => {
      setCurrentSessionId(data.id);
      setLocation(`/chat/${data.id}`);
      queryClient.invalidateQueries({ queryKey: ["/api/chat/sessions"] });
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (messageContent: string) => {
      const response = await apiRequest("POST", `/api/chat/${currentSessionId}/message`, {
        message: messageContent,
      });
      return response.json();
    },
    onSuccess: () => {
      setMessage("");
      queryClient.invalidateQueries({ queryKey: ["/api/chat/sessions", currentSessionId] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Gagal mengirim pesan",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !currentSessionId) return;
    sendMessageMutation.mutate(message.trim());
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages]);

  if (!user) return null;

  const messages = currentSession?.messages || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-pink-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Chat Sessions</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <Button
                  onClick={() => createSessionMutation.mutate()}
                  disabled={createSessionMutation.isPending}
                  className="w-full mb-4 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700"
                >
                  <i className="fas fa-plus mr-2"></i>
                  Chat Baru
                </Button>
                
                <div className="space-y-2">
                  {chatSessions?.map((session: any) => (
                    <button
                      key={session.id}
                      onClick={() => {
                        setCurrentSessionId(session.id);
                        setLocation(`/chat/${session.id}`);
                      }}
                      className={`w-full p-3 text-left rounded-lg transition-colors ${
                        currentSessionId === session.id
                          ? "bg-teal-100 text-teal-700"
                          : "bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      <div className="font-medium text-sm">
                        {session.counselorId ? "Konselor" : "AI Chat"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(session.updatedAt).toLocaleDateString("id-ID")}
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            <Card className="h-[700px] flex flex-col">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center">
                  <div className="bg-teal-100 p-2 rounded-lg mr-3">
                    <i className="fas fa-robot text-teal-600"></i>
                  </div>
                  <div>
                    <div className="font-semibold">AI Counselor</div>
                    <div className="text-sm text-gray-500 font-normal">
                      Siap membantu 24/7
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              
              {!currentSessionId ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="fas fa-comments text-teal-600 text-2xl"></i>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Mulai Chat Baru
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Ceritakan apa yang kamu rasakan hari ini
                    </p>
                    <Button
                      onClick={() => createSessionMutation.mutate()}
                      disabled={createSessionMutation.isPending}
                      className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700"
                    >
                      <i className="fas fa-plus mr-2"></i>
                      Mulai Chat
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.length === 0 && (
                      <div className="text-center text-gray-500 py-8">
                        <p>Halo! Aku AI counselor yang siap mendengarkan ceritamu.</p>
                        <p>Ceritakan apa yang ingin kamu bicarakan hari ini.</p>
                      </div>
                    )}
                    
                    {messages.map((msg: any) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            msg.role === "user"
                              ? "bg-teal-500 text-white"
                              : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <p className={`text-xs mt-1 ${
                            msg.role === "user" ? "text-teal-100" : "text-gray-500"
                          }`}>
                            {new Date(msg.timestamp).toLocaleTimeString("id-ID", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    {sendMessageMutation.isPending && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <i className="fas fa-spinner fa-spin"></i>
                            <span className="text-sm">AI sedang mengetik...</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="border-t p-4">
                    <form onSubmit={handleSendMessage} className="flex space-x-2">
                      <Input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Ketik pesanmu di sini..."
                        disabled={sendMessageMutation.isPending}
                        className="flex-1"
                      />
                      <Button
                        type="submit"
                        disabled={!message.trim() || sendMessageMutation.isPending}
                        className="bg-teal-500 hover:bg-teal-600"
                      >
                        <i className="fas fa-paper-plane"></i>
                      </Button>
                    </form>
                  </div>
                </>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
