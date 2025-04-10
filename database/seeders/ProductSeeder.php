<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // First clear existing products
        Product::truncate();

        // Check if we have the db.json file with products
        $dbJsonPath = resource_path('js/pages/Home/db.json');

        if (File::exists($dbJsonPath)) {
            // Load products from existing db.json file
            $jsonData = json_decode(File::get($dbJsonPath), true);

            if (is_array($jsonData) && count($jsonData) > 0) {
                foreach ($jsonData as $categoryProducts) {
                    if (is_array($categoryProducts)) {
                        foreach ($categoryProducts as $product) {
                            // Map only needed fields and ensure db compatibility
                            Product::create([
                                'name' => $product['name'] ?? 'Unknown Product',
                                'brand' => $product['brand'] ?? 'Unknown Brand',
                                'category' => $product['category'] ?? 'other',
                                'imageUrl' => $product['imageUrl'] ?? 'https://via.placeholder.com/400',
                                'price' => $product['price'] ?? 0,
                                'stars' => $product['stars'] ?? 0,
                                'numReviews' => $product['numReviews'] ?? 0,
                            ]);
                        }
                    }
                }

                $this->command->info('Imported products from db.json successfully!');
            } else {
                // If JSON data is invalid, use factory instead
                $this->seedFromFactory();
            }
        } else {
            // If db.json doesn't exist, use factory instead
            $this->seedFromFactory();
        }
    }

    /**
     * Seed database using factory when JSON data is not available
     */
    private function seedFromFactory(): void
    {
        $this->command->info('No valid db.json found. Creating products using factory...');
        Product::factory(100)->create();
        $this->command->info('Created 100 sample products using factory!');
    }
}
