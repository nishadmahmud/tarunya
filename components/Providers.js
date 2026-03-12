"use client";

import { CartProvider } from "../context/CartContext";
import { AuthProvider } from "../context/AuthContext";
import { ShareSelectionProvider } from "../context/ShareSelectionContext";
import CartSidebar from "./Shared/CartSidebar";
import ShareBar from "./Shared/ShareBar";
import AuthModal from "./Auth/AuthModal";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }) {
    return (
        <AuthProvider>
            <ShareSelectionProvider>
                <CartProvider>
                    {children}
                    <CartSidebar />
                    <ShareBar />
                    <AuthModal />
                    <Toaster
                        position="top-center"
                        toastOptions={{
                            duration: 3000,
                            style: {
                                background: '#1a4a1a',
                                color: '#fff',
                                fontSize: '14px',
                                borderRadius: '12px',
                            },
                        }}
                    />
                </CartProvider>
            </ShareSelectionProvider>
        </AuthProvider>
    );
}
