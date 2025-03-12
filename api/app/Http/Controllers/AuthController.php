<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\LoginToken; // Para el modelo
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use App\Mail\LoginTokenMail; // Importa la clase de correo

class AuthController extends Controller
{
    public function requestToken(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Usuario no encontrado'
            ], 404);
        }

        // Generar token
        $plainTextToken = Str::random(32);
        $hashedToken = Hash::make($plainTextToken);

        // Eliminar tokens anteriores
        LoginToken::where('user_id', $user->id)->delete();

        // Crear nuevo token
        LoginToken::create([
            'user_id' => $user->id,
            'token' => $hashedToken,
            'expires_at' => now()->addHours(1),
        ]);

        // Enviar el token por correo
        Mail::to($user->email)->send(new LoginTokenMail($plainTextToken));

        return response()->json([
            'message' => 'Token enviado por correo electrónico'
        ]);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'token' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Usuario no encontrado'
            ], 404);
        }

        // Buscar tokens válidos para este usuario
        $loginToken = LoginToken::where('user_id', $user->id)
            ->where('expires_at', '>', now())
            ->first();

        if (!$loginToken) {
            return response()->json([
                'message' => 'No hay tokens válidos para este usuario'
            ], 401);
        }

        // Verificar el token
        if (Hash::check($request->token, $loginToken->token)) {
            // Eliminar el token usado
            $loginToken->delete();

            // Revocar todos los tokens existentes (opcional)
            $user->tokens()->delete();

            // Crear un nuevo token de autenticación de Sanctum
            $token = $user->createToken('auth-token');

            return response()->json([
                'message' => 'Autenticación exitosa',
                'token' => $token->plainTextToken
            ]);
        }

        return response()->json([
            'message' => 'Token inválido'
        ], 401);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Sesión cerrada correctamente'
        ]);
    }
}
