import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Mail, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";

interface OtpVerificationProps {
  email: string;
  onVerify: (code: string) => Promise<{ error?: { message: string } }>;
  onResend: () => Promise<{ error?: { message: string } }>;
  onBack: () => void;
  isLoading?: boolean;
  
  title?: string;
  description?: string;
}

export function OtpVerification({
  email,
  onVerify,
  onResend,
  onBack,
  isLoading = false,
  
  title = "Verify Your Email",
  description = "We've sent a 6-digit code to your email"
}: OtpVerificationProps) {
  const [otpValue, setOtpValue] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  // Auto-submit when OTP is complete
  useEffect(() => {
    if (otpValue.length === 6 && !isVerifying) {
      handleVerify();
    }
  }, [otpValue]);

  const handleVerify = async () => {
    if (otpValue.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter the complete 6-digit code",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    try {
      const result = await onVerify(otpValue);
      
      if (result.error) {
        toast({
          title: "Verification Failed",
          description: result.error.message,
          variant: "destructive",
        });
        // Reset OTP on error
        setOtpValue("");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      setOtpValue("");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    try {
      const result = await onResend();
      
      if (result.error) {
        toast({
          title: "Failed to Resend",
          description: result.error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Code Sent",
          description: "A new verification code has been sent to your email.",
        });
        setCountdown(60);
        setCanResend(false);
        setOtpValue("");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resend code",
        variant: "destructive",
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-3">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
          <Mail className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
        <p className="text-muted-foreground">
          {description}
        </p>
        <p className="text-sm font-medium text-foreground">
          {email}
        </p>
      </div>

      <div className="space-y-4">

        <div className="flex justify-center">
          <InputOTP 
            ref={inputRef}
            maxLength={6} 
            value={otpValue} 
            onChange={setOtpValue}
            disabled={isVerifying || isLoading}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        {/* Status indicators */}
        <div className="text-center space-y-2">
          {isVerifying && (
            <p className="text-sm text-primary animate-pulse">
              Verifying your code...
            </p>
          )}
          
          {!canResend && countdown > 0 && (
            <p className="text-sm text-muted-foreground">
              Resend code in {formatTime(countdown)}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <Button 
          onClick={handleVerify}
          disabled={otpValue.length !== 6 || isVerifying || isLoading}
          className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground font-medium py-3 transition-all duration-200"
        >
          {isVerifying ? "Verifying..." : "Verify Code"}
        </Button>

        <div className="text-center">
          <p className="text-muted-foreground text-sm mb-2">
            Didn't receive the code?
          </p>
          <Button
            type="button"
            variant="ghost"
            onClick={handleResend}
            disabled={!canResend || isLoading}
            className="text-primary hover:text-primary/80 disabled:text-muted-foreground"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            {canResend ? "Resend Code" : `Resend in ${formatTime(countdown)}`}
          </Button>
        </div>

        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          disabled={isLoading}
          className="w-full text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Additional help */}
      <div className="text-center text-xs text-muted-foreground space-y-1">
        <p>Check your spam folder if you don't see the email</p>
        <p>The code expires in 10 minutes</p>
      </div>
    </div>
  );
}