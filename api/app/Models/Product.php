<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    //campos que seran llenados
    protected $fillable = ['name', 'description', 'price', 'stock'];
}
