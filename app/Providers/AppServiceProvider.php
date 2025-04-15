<?php

namespace App\Providers;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use Illuminate\Http\Resources\Json\JsonResource;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Convert snake_case attribute names to camelCase in API responses
        JsonResource::withoutWrapping();

        // Transform snake_case to camelCase for all JSON responses
        Model::$snakeAttributes = false;
    }
}
