<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\InventoryMovement;
use App\Models\Product;
use Illuminate\Http\Request;

class InventoryMovementController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'type' => 'required|in:entrada,salida',
            'quantity' => 'required|integer|min:1',
        ]);

        // Encontrar el producto
        $product = Product::findOrFail($request->product_id);

        // Si es salida, verificar que haya suficiente stock
        if ($request->type === 'salida' && $product->stock < $request->quantity) {
            return response()->json(['message' => 'Stock insuficiente'], 400);
        }

        // Registrar el movimiento
        InventoryMovement::create($request->all());

        // Actualizar el stock del producto
        if ($request->type === 'entrada') {
            $product->increment('stock', $request->quantity);
        } else {
            $product->decrement('stock', $request->quantity);
        }

        return response()->json(['message' => 'Movimiento registrado con éxito'], 201);
    }
}
