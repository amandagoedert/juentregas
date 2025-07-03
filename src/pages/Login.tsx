// src/pages/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { LogIn } from "lucide-react"; // Importe o ícone de login

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Simulação de autenticação
    // Em um cenário real, você faria uma chamada API para validar as credenciais no backend
    if (email === "admin@juentregas.com" && password === "admin123") {
      toast({
        title: "Login bem-sucedido!",
        description: "Redirecionando para o painel de administrador.",
        variant: "default",
      });
      navigate("/admin/dashboard"); // Redireciona para o dashboard
    } else {
      toast({
        title: "Erro de login",
        description: "E-mail ou senha inválidos. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-surface flex items-center justify-center">
      <Card className="w-full max-w-md shadow-elegant">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Acesso Administrativo</CardTitle>
          <CardDescription className="text-lg">
            Apenas para usuários autorizados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@juentregas.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-10 text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-10 text-base"
              />
            </div>
            <Button type="submit" variant="cta" size="lg" className="w-full h-12">
              <LogIn className="mr-2 h-5 w-5" />
              Entrar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;