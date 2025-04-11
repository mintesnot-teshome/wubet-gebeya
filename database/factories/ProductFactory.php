<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $categories = ['makeup', 'skincare', 'hair', 'fragrance', 'tools', 'bath'];
        $brands = ['Sephora', 'MAC', 'Dior', 'Fenty Beauty', 'Olay', 'L\'Oreal', 'Maybelline', 'Nivea'];

        return [
            'name' => fake()->sentence(3),
            'brand' => fake()->randomElement($brands),
            'category' => fake()->randomElement($categories),
            'imageUrl' => fake()->imageUrl(640, 480, 'beauty', true),
            'price' => fake()->randomFloat(2, 5, 200),
            'stars' => fake()->randomFloat(1, 0, 5),
            'type' => fake()->sentence(8),
            'numReviews' => fake()->numberBetween(0, 500),
        ];
    }
}
