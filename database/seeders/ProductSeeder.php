<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\DB;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Disable foreign key checks to allow truncating the table
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        // Clear existing products
        Product::truncate();

        // Re-enable foreign key checks
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // Check if we have the db.json file with products
        $dbJsonPath = base_path('db.json');

        if (File::exists($dbJsonPath)) {
            // Load products from existing db.json file
            $jsonData = json_decode(File::get($dbJsonPath), true);

            if (is_array($jsonData) && count($jsonData) > 0) {
                $importCount = 0;

                foreach ($jsonData as $product) {
                    // Skip entries that don't have the required product data
                    if (!isset($product['name']) || !isset($product['brand'])) {
                        continue;
                    }

                    // Calculate discount information for some products
                    $isDiscount = rand(0, 100) < 30; // 30% chance of being a discounted product
                    $originalPrice = null;
                    $discountPercentage = null;
                    $price = $product['price'] ?? 0;
                    $isDeal = false;

                    if ($isDiscount) {
                        $discountPercentage = rand(10, 50); // Random discount between 10% and 50%
                        $originalPrice = $price;
                        $price = round($originalPrice * (100 - $discountPercentage) / 100, 2);
                        $isDeal = $discountPercentage >= 20; // Products with 20% or more discount are marked as deals
                    }

                    // Map fields and ensure db compatibility
                    Product::create([
                        'name' => $product['name'] ?? 'Unknown Product',
                        'brand' => $product['brand'] ?? 'Unknown Brand',
                        'category' => $product['category'] ?? 'other',
                        'imageUrl' => $product['imageUrl'] ?? 'https://via.placeholder.com/400',
                        'price' => $price,
                        'original_price' => $originalPrice,
                        'discount_percentage' => $discountPercentage,
                        'is_deal' => $isDeal,
                        'stars' => $product['stars'] ?? 0,
                        'type' => $product['type'] ?? 'Unknown Type',
                        'numReviews' => $product['numReviews'] ?? 0,
                    ]);

                    $importCount++;
                }

                $this->command->info("Imported {$importCount} products from db.json successfully!");
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

        // Create regular products
        Product::factory(70)->create();

        // Create discounted products
        Product::factory(30)->create()->each(function ($product) {
            $discountPercentage = rand(10, 50);
            $originalPrice = $product->price;
            $discountedPrice = round($originalPrice * (100 - $discountPercentage) / 100, 2);

            $product->update([
                'original_price' => $originalPrice,
                'price' => $discountedPrice,
                'discount_percentage' => $discountPercentage,
                'is_deal' => ($discountPercentage >= 20) // Products with 20% or more discount are deals
            ]);
        });

        $this->command->info('Created 100 sample products using factory (including 30 with discounts)!');
    }
}
