import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/stores/authStore';
import { useLoginMutation, useSignupMutation } from '@/hooks/useAuthMutations';
import {
    loginSchema,
    signupSchema,
    LoginFormData,
    SignupFormData,
} from '@/schemas/authSchemas';
import { Loader2, Mail, Lock, User } from 'lucide-react';

const Auth = () => {
    const { user, isAuthenticated } = useAuthStore();
    const loginMutation = useLoginMutation();
    const signupMutation = useSignupMutation();
    const navigate = useNavigate();
    const location = useLocation();

    // React Hook Form setup for login
    const loginForm = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    // React Hook Form setup for signup
    const signupForm = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            fullName: '',
            email: '',
            password: '',
        },
    });

    useEffect(() => {
        if (isAuthenticated && user) {
            // Redirect to the page they were trying to access, or home
            const from =
                (location.state as { from?: { pathname: string } })?.from
                    ?.pathname || '/';
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, user, navigate, location]);

    const onLoginSubmit = (data: LoginFormData) => {
        loginMutation.mutate(data);
    };

    const onSignupSubmit = (data: SignupFormData) => {
        signupMutation.mutate(data);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">
                        Knowledge Base Chat
                    </CardTitle>
                    <CardDescription>
                        Sign in to your account or create a new one
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="login" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="login">Login</TabsTrigger>
                            <TabsTrigger value="signup">Sign Up</TabsTrigger>
                        </TabsList>

                        <TabsContent value="login" className="space-y-4">
                            <form
                                onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                                className="space-y-4"
                            >
                                <div className="space-y-2">
                                    <Label htmlFor="login-email">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="login-email"
                                            type="email"
                                            placeholder="Enter your email"
                                            className="pl-10"
                                            {...loginForm.register('email')}
                                            disabled={loginMutation.isPending}
                                        />
                                    </div>
                                    {loginForm.formState.errors.email && (
                                        <p className="text-sm text-red-500">
                                            {
                                                loginForm.formState.errors.email
                                                    .message
                                            }
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="login-password">
                                        Password
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="login-password"
                                            type="password"
                                            placeholder="Enter your password"
                                            className="pl-10"
                                            {...loginForm.register('password')}
                                            disabled={loginMutation.isPending}
                                        />
                                    </div>
                                    {loginForm.formState.errors.password && (
                                        <p className="text-sm text-red-500">
                                            {
                                                loginForm.formState.errors
                                                    .password.message
                                            }
                                        </p>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={loginMutation.isPending}
                                >
                                    {loginMutation.isPending && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    Sign In
                                </Button>
                            </form>
                        </TabsContent>

                        <TabsContent value="signup" className="space-y-4">
                            <form
                                onSubmit={signupForm.handleSubmit(
                                    onSignupSubmit
                                )}
                                className="space-y-4"
                            >
                                <div className="space-y-2">
                                    <Label htmlFor="signup-name">
                                        Full Name
                                    </Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="signup-name"
                                            type="text"
                                            placeholder="Enter your full name"
                                            className="pl-10"
                                            {...signupForm.register('fullName')}
                                            disabled={signupMutation.isPending}
                                        />
                                    </div>
                                    {signupForm.formState.errors.fullName && (
                                        <p className="text-sm text-red-500">
                                            {
                                                signupForm.formState.errors
                                                    .fullName.message
                                            }
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="signup-email">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="signup-email"
                                            type="email"
                                            placeholder="Enter your email"
                                            className="pl-10"
                                            {...signupForm.register('email')}
                                            disabled={signupMutation.isPending}
                                        />
                                    </div>
                                    {signupForm.formState.errors.email && (
                                        <p className="text-sm text-red-500">
                                            {
                                                signupForm.formState.errors
                                                    .email.message
                                            }
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="signup-password">
                                        Password
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="signup-password"
                                            type="password"
                                            placeholder="Create a password"
                                            className="pl-10"
                                            {...signupForm.register('password')}
                                            disabled={signupMutation.isPending}
                                        />
                                    </div>
                                    {signupForm.formState.errors.password && (
                                        <p className="text-sm text-red-500">
                                            {
                                                signupForm.formState.errors
                                                    .password.message
                                            }
                                        </p>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={signupMutation.isPending}
                                >
                                    {signupMutation.isPending && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    Create Account
                                </Button>
                            </form>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
};

export default Auth;
