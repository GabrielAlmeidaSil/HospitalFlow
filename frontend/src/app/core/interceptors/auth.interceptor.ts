import { inject } from "@angular/core";
import { HttpInterceptorFn } from "@angular/common/http";
import { Auth } from "../services/auth";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(Auth)
    const token = authService.obterToken();

    if(!token) {
        return next(req);
    }

    const requisicaoAutenticada = req.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`
        }
    });

    return next(requisicaoAutenticada)
}