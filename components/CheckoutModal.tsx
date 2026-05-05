'use client';

import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { X, CreditCard, BookmarkCheck, CheckCircle2, Upload, Copy, Check, Loader2, QrCode } from 'lucide-react';
import { fileToBase64 } from '@/lib/image-utils';
import { generatePixPayload } from '@/lib/pix-utils';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    title: string;
    price: number;
    images: string[];
  } | null;
}

type Step = 'method' | 'info' | 'pix' | 'success';

export function CheckoutModal({ isOpen, onClose, product }: CheckoutModalProps) {
  const [step, setStep] = useState<Step>('method');
  const [method, setMethod] = useState<'buy' | 'reserve'>('buy');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [pixProof, setPixProof] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !product) return null;

  const buyPrice = product.price;
  const reservePrice = product.price * 0.5;
  const currentPrice = method === 'buy' ? buyPrice : reservePrice;
  
  // Gerar o Payload Dinâmico do PIX
  const pixPayload = generatePixPayload({
    key: 'crorioli@hotmail.com',
    name: 'Carlos Rogerio Orioli',
    city: 'SAO PAULO',
    amount: currentPrice,
    transactionId: product.id.substring(0, 10) // Limita o TxID
  });

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(pixPayload)}`;

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixPayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const base64 = await fileToBase64(file);
      setPixProof(base64);
    }
  };

  const handleNext = () => {
    if (step === 'method') setStep('info');
    else if (step === 'info') setStep('pix');
  };

  const handleSubmit = async () => {
    if (!pixProof) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          buyerName: formData.name,
          buyerEmail: formData.email,
          buyerPhone: formData.phone,
          tipoAcao: method === 'buy' ? 'compra' : 'reserva',
          pixProof: pixProof,
          amountPaid: currentPrice,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao processar checkout');
      }

      setStep('success');
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setStep('method');
    setFormData({ name: '', email: '', phone: '' });
    setPixProof(null);
    setFileName(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={handleClose}
      />
      
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl animate-in zoom-in-95 fade-in duration-300">
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 rounded-full p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-8">
          {step === 'success' ? (
            <div className="flex flex-col items-center justify-center py-12 text-center animate-in zoom-in-50 duration-500">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle2 className="h-10 w-10 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-zinc-900">Solicitação Enviada!</h2>
              <p className="mt-2 text-zinc-500">
                Enviamos os detalhes para o seu e-mail. <br />
                Verifique sua caixa de entrada!
              </p>
              <button
                onClick={handleClose}
                className="mt-8 w-full rounded-2xl bg-zinc-900 py-4 font-bold text-white transition-all hover:bg-zinc-800"
              >
                Fechar
              </button>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-zinc-900">Checkout</h2>
                <p className="mt-1 text-sm text-zinc-500">Passo {step === 'method' ? '1' : step === 'info' ? '2' : '3'} de 3</p>
              </div>

              {step === 'method' && (
                <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                  <button
                    onClick={() => setMethod('buy')}
                    className={cn(
                      "flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all",
                      method === 'buy' ? "border-zinc-900 bg-zinc-50" : "border-zinc-100"
                    )}
                  >
                    <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", method === 'buy' ? "bg-zinc-900 text-white" : "bg-zinc-100")}>
                      <CreditCard className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-zinc-900">Comprar Agora</p>
                      <p className="text-xs text-zinc-500">Pagamento integral (100%)</p>
                    </div>
                    <p className="font-bold">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(buyPrice)}</p>
                  </button>

                  <button
                    onClick={() => setMethod('reserve')}
                    className={cn(
                      "flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all",
                      method === 'reserve' ? "border-zinc-900 bg-zinc-50" : "border-zinc-100"
                    )}
                  >
                    <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", method === 'reserve' ? "bg-zinc-900 text-white" : "bg-zinc-100")}>
                      <BookmarkCheck className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-zinc-900">Reservar</p>
                      <p className="text-xs text-zinc-500">Garantir item (50%)</p>
                    </div>
                    <p className="font-bold">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(reservePrice)}</p>
                  </button>

                  <button onClick={handleNext} className="mt-8 w-full rounded-2xl bg-zinc-900 py-4 font-bold text-white hover:bg-zinc-800">
                    Continuar
                  </button>
                </div>
              )}

              {step === 'info' && (
                <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-600 ml-1">Nome Completo</label>
                    <input
                      type="text"
                      className="mt-2 w-full rounded-xl border border-zinc-200 p-4 text-zinc-900 placeholder:text-zinc-300 focus:border-zinc-900 focus:outline-none transition-all"
                      placeholder="Como você se chama?"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-600 ml-1">E-mail</label>
                    <input
                      type="email"
                      className="mt-2 w-full rounded-xl border border-zinc-200 p-4 text-zinc-900 placeholder:text-zinc-300 focus:border-zinc-900 focus:outline-none transition-all"
                      placeholder="Seu melhor e-mail"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-600 ml-1">WhatsApp</label>
                    <input
                      type="tel"
                      className="mt-2 w-full rounded-xl border border-zinc-200 p-4 text-zinc-900 placeholder:text-zinc-300 focus:border-zinc-900 focus:outline-none transition-all"
                      placeholder="(00) 00000-0000"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <button 
                    disabled={!formData.name || !formData.email || !formData.phone}
                    onClick={handleNext} 
                    className="mt-8 w-full rounded-2xl bg-zinc-900 py-4 font-bold text-white transition-all hover:bg-zinc-800 disabled:bg-zinc-100 disabled:text-zinc-400 disabled:cursor-not-allowed"
                  >
                    Ir para Pagamento
                  </button>
                  <button 
                    onClick={() => setStep('method')} 
                    className="w-full py-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
                  >
                    Voltar
                  </button>
                </div>
              )}

              {step === 'pix' && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  <div className="rounded-3xl bg-zinc-50 p-6 text-center">
                    <p className="text-sm text-zinc-500 font-medium">Valor total a pagar:</p>
                    <p className="mt-1 text-4xl font-black text-zinc-900">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(currentPrice)}
                    </p>
                    
                    {/* Toggle QR Code vs Copy/Paste */}
                    <div className="mt-8 flex flex-col items-center gap-4">
                      {showQrCode ? (
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-zinc-100 animate-in zoom-in-95">
                          <img src={qrCodeUrl} alt="QR Code PIX" className="w-48 h-48 mx-auto" />
                        </div>
                      ) : (
                        <div className="w-full space-y-3">
                          <div className="flex items-center justify-between rounded-2xl bg-white p-4 border border-zinc-200 shadow-sm">
                            <div className="flex-1 overflow-hidden pr-4">
                              <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold mb-1">Código Copia e Cola</p>
                              <code className="text-xs font-mono text-zinc-600 block truncate">{pixPayload}</code>
                            </div>
                            <button 
                              onClick={handleCopyPix}
                              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 transition-colors"
                            >
                              {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                            </button>
                          </div>
                        </div>
                      )}

                      <button 
                        onClick={() => setShowQrCode(!showQrCode)}
                        className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 transition-colors"
                      >
                        {showQrCode ? (
                          <><Copy className="h-3 w-3" /> Usar Copia e Cola</>
                        ) : (
                          <><QrCode className="h-3 w-3" /> Ver QR Code</>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-600 ml-1">Anexar Comprovante</label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className={cn(
                        "group flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed p-6 transition-all duration-300",
                        pixProof 
                          ? "border-emerald-500 bg-emerald-50/50" 
                          : "border-zinc-200 hover:border-zinc-900 hover:bg-zinc-50"
                      )}
                    >
                      {pixProof ? (
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-bold text-emerald-900 truncate max-w-[200px]">{fileName}</p>
                            <p className="text-[10px] font-bold uppercase text-emerald-600">Comprovante anexado</p>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                            <Upload className="h-6 w-6" />
                          </div>
                          <p className="text-sm font-bold text-zinc-900">Clique para enviar o print</p>
                          <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">PNG ou JPG até 5MB</p>
                        </>
                      )}
                      <input 
                        ref={fileInputRef}
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleFileChange} 
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button 
                      disabled={!pixProof || isLoading}
                      onClick={handleSubmit}
                      className="flex w-full items-center justify-center gap-3 rounded-2xl bg-zinc-900 py-4 font-bold text-white shadow-xl shadow-zinc-200 transition-all hover:bg-zinc-800 hover:translate-y-[-2px] active:scale-[0.98] disabled:bg-zinc-100 disabled:text-zinc-400 disabled:translate-y-0 disabled:shadow-none disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>Finalizar Solicitação</>
                      )}
                    </button>
                    <button 
                      onClick={() => setStep('info')} 
                      className="mt-4 w-full text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 transition-colors"
                    >
                      Voltar
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
