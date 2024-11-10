<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Graph extends Model
{
    protected $keyType = 'string';
    public $incrementing = false;
    protected $fillable = ['nodes', 'edges'];

    protected static function boot() {
        parent::boot();
        static::creating(function ($graph) {
            if (empty($graph->id)) {
                $graph->id = (string) Str::uuid();
            }
        });
    }
}
