import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Calculator,
  MessageCircle,
  Truck,
  Package,
  MapPin,
  Clock,
  Shield,
  Phone,
  Mail,
  User
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

const Cotacao = () => {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    empresa: "",
    origem: "",
    destino: "",
    peso: "",
    dimensoes: "",
    tipoEncomenda: "",
    urgente: false,
    refrigerada: false,
    seguro: false,
    observacoes: ""
  });

  const { toast } = useToast();

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers.replace(/(\d{2})(\d{4,5})(\d{4})/, "($1) $2-$3");
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    if (formatted.length <= 15) {
      handleInputChange('telefone', formatted);
    }
  };

  const generateWhatsAppMessage = () => {
    const message = `
🚚 *Solicitação de Cotação - JuEntregas*

👤 *Dados do Solicitante:*
• Nome: ${formData.nome}
• Email: ${formData.email}
• Telefone: ${formData.telefone}
${formData.empresa ? `• Empresa: ${formData.empresa}` : ''}

📦 *Detalhes da Encomenda:*
• Origem: ${formData.origem}
• Destino: ${formData.destino}
• Peso: ${formData.peso}
• Dimensões: ${formData.dimensoes}
• Tipo: ${formData.tipoEncomenda}

🔧 *Serviços Adicionais:*
${formData.urgente ? '• ✅ Entrega Urgente' : ''}
${formData.refrigerada ? '• ❄️ Refrigerada' : ''}
${formData.seguro ? '• 🛡️ Seguro' : ''}

${formData.observacoes ? `💬 *Observações:*\n${formData.observacoes}` : ''}

Aguardo retorno com a cotação! 😊
    `.trim();

    return encodeURIComponent(message);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.nome || !formData.telefone || !formData.origem || !formData.destino) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const whatsappMessage = generateWhatsAppMessage();
    const whatsappNumber = "5521986039803"; // Número da empresa
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
    
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "Redirecionando para WhatsApp",
      description: "Você será direcionado para continuar a conversa no WhatsApp.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-surface">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Solicite sua Cotação
          </h1>
          <p className="text-xl text-muted-foreground">
            Preencha os dados abaixo e receba um orçamento personalizado
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário */}
          <div className="lg:col-span-2">
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="mr-2 h-6 w-6" />
                  Dados para Cotação
                </CardTitle>
                <CardDescription>
                  Quanto mais detalhes você fornecer, mais precisa será nossa cotação
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Dados Pessoais */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Dados de Contato</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="nome">Nome Completo *</Label>
                        <Input
                          id="nome"
                          value={formData.nome}
                          onChange={(e) => handleInputChange('nome', e.target.value)}
                          placeholder="Seu nome completo"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="telefone">Telefone *</Label>
                        <Input
                          id="telefone"
                          value={formData.telefone}
                          onChange={handlePhoneChange}
                          placeholder="(00) 00000-0000"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">E-mail</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="seu@email.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="empresa">Empresa (opcional)</Label>
                        <Input
                          id="empresa"
                          value={formData.empresa}
                          onChange={(e) => handleInputChange('empresa', e.target.value)}
                          placeholder="Nome da empresa"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Dados da Encomenda */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Dados da Encomenda</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="origem">Origem *</Label>
                        <Input
                          id="origem"
                          value={formData.origem}
                          onChange={(e) => handleInputChange('origem', e.target.value)}
                          placeholder="Cidade de origem"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="destino">Destino *</Label>
                        <Input
                          id="destino"
                          value={formData.destino}
                          onChange={(e) => handleInputChange('destino', e.target.value)}
                          placeholder="Cidade de destino"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="peso">Peso</Label>
                        <Input
                          id="peso"
                          value={formData.peso}
                          onChange={(e) => handleInputChange('peso', e.target.value)}
                          placeholder="Ex: 5kg"
                        />
                      </div>
                      <div>
                        <Label htmlFor="dimensoes">Dimensões</Label>
                        <Input
                          id="dimensoes"
                          value={formData.dimensoes}
                          onChange={(e) => handleInputChange('dimensoes', e.target.value)}
                          placeholder="C x L x A (cm)"
                        />
                      </div>
                      <div>
                        <Label htmlFor="tipoEncomenda">Tipo de Encomenda</Label>
                        <Select onValueChange={(value) => handleInputChange('tipoEncomenda', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="encomenda-normal">Encomenda Normal</SelectItem>
                            <SelectItem value="encomenda-refrigerada">Encomenda Refrigerada</SelectItem>
                            <SelectItem value="carga-pesada">Carga Pesada (até 30T)</SelectItem>
                            <SelectItem value="documento">Documento</SelectItem>
                            <SelectItem value="fragil">Produto Frágil</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Serviços Adicionais */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Serviços Adicionais</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="urgente"
                          checked={formData.urgente}
                          onCheckedChange={(checked) => handleInputChange('urgente', checked as boolean)}
                        />
                        <Label htmlFor="urgente" className="text-sm">
                          Entrega Urgente (24h)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="refrigerada"
                          checked={formData.refrigerada}
                          onCheckedChange={(checked) => handleInputChange('refrigerada', checked as boolean)}
                        />
                        <Label htmlFor="refrigerada" className="text-sm">
                          Transporte Refrigerado
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="seguro"
                          checked={formData.seguro}
                          onCheckedChange={(checked) => handleInputChange('seguro', checked as boolean)}
                        />
                        <Label htmlFor="seguro" className="text-sm">
                          Seguro da Encomenda
                        </Label>
                      </div>
                    </div>
                  </div>

                  {/* Observações */}
                  <div>
                    <Label htmlFor="observacoes">Observações</Label>
                    <Textarea
                      id="observacoes"
                      value={formData.observacoes}
                      onChange={(e) => handleInputChange('observacoes', e.target.value)}
                      placeholder="Informações adicionais sobre a encomenda..."
                      className="min-h-[100px]"
                    />
                  </div>

                  {/* Botão de Envio */}
                  <Button type="submit" variant="hero" size="lg" className="w-full">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Enviar Cotação via WhatsApp
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Informações de Contato */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Contato Direto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold">(21) 98603-9803</p>
                    <p className="text-sm text-muted-foreground">WhatsApp disponível</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold">contato@juentregas.com</p>
                    <p className="text-sm text-muted-foreground">E-mail comercial</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold">Seg - Sex: 8h às 18h</p>
                    <p className="text-sm text-muted-foreground">Sáb: 8h às 12h</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Diferenciais */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Por que escolher a JuEntregas?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Segurança Garantida</p>
                    <p className="text-xs text-muted-foreground">Suas encomendas protegidas</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Truck className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Frota Moderna</p>
                    <p className="text-xs text-muted-foreground">Veículos equipados e rastreados</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Cobertura Regional</p>
                    <p className="text-xs text-muted-foreground">Atendimento em todo o Sul</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Package className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Rastreamento Online</p>
                    <p className="text-xs text-muted-foreground">Acompanhe em tempo real</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Call to Action */}
            <Card className="shadow-card bg-gradient-primary text-white">
              <CardContent className="pt-6 text-center">
                <User className="h-12 w-12 mx-auto mb-4 opacity-80" />
                <h3 className="font-bold mb-2">Atendimento Personalizado</h3>
                <p className="text-sm opacity-90 mb-4">
                  Nossa equipe está pronta para atender suas necessidades específicas
                </p>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="w-full"
                  onClick={() => window.open('https://wa.me/5521986039803', '_blank')}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Falar no WhatsApp
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Cotacao;