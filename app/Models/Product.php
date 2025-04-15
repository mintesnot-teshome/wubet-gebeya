<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'brand',
        'category',
        'imageUrl',
        'price',
        'original_price',
        'discount_percentage',
        'is_deal',
        'stars',
        'type',
        'numReviews',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'price' => 'float',
        'original_price' => 'float',
        'discount_percentage' => 'integer',
        'is_deal' => 'boolean',
        'stars' => 'float',
        'numReviews' => 'integer',
    ];
}
