import React, { useState, useEffect, useRef } from 'react';
import { BsSearch } from 'react-icons/bs';
import { router } from '@inertiajs/react';
import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import './SearchBar.css';

interface Suggestion {
  id?: number;
  text: string;
  brand?: string;
  category?: string;
  image?: string;
  type: 'product' | 'category' | 'brand';
}

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const toast = useToast();

  // Debounce search to avoid too many API calls while typing
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm.trim().length >= 2) {
        fetchSuggestions();
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchSuggestions = async () => {
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    try {
      const response = await axios.get(route('product.search.suggestions'), {
        params: { q: searchTerm.trim() }
      });
      setSuggestions(response.data.suggestions || []);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchTerm.trim()) {
      return;
    }

    executeSuggestion({ text: searchTerm.trim(), type: 'product' });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Arrow navigation in suggestions list
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      executeSuggestion(suggestions[selectedIndex]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const executeSuggestion = (suggestion: Suggestion) => {
    setShowSuggestions(false);

    let params = {};

    if (suggestion.type === 'category') {
      params = { category: suggestion.text };
    } else if (suggestion.type === 'brand') {
      params = { search: suggestion.text };
    } else if (suggestion.id) {
      // If it's a specific product, navigate to that product
      router.visit(route('product.show', { id: suggestion.id }));
      return;
    } else {
      // Regular search query
      params = { search: suggestion.text };
    }

    // Navigate to products page with search param
    router.get(route('products'), params, {
      preserveState: true,
      only: ['products', 'filters'],
    });

    // Show toast notification
    toast({
      title: 'Searching...',
      description: `Showing results for "${suggestion.text}"`,
      status: 'info',
      duration: 2000,
      isClosable: true,
      position: 'top',
    });
  };

  // Highlight matching text in suggestions
  const highlightMatch = (text: string) => {
    if (!searchTerm) return text;

    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);

    return (
      <>
        {parts.map((part, i) => (
          regex.test(part) ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>
        ))}
      </>
    );
  };

  return (
    <div className="search-container" ref={searchRef}>
      <form onSubmit={handleSubmit} className="navSearch">
        <BsSearch />
        <input
          type="search"
          placeholder="Search products, brands..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => {
            if (suggestions.length > 0) setShowSuggestions(true);
          }}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="suggestions-dropdown">
          {suggestions.map((suggestion, index) => (
            <div
              key={`${suggestion.type}-${suggestion.text}-${index}`}
              className={`suggestion-item ${selectedIndex === index ? 'selected' : ''}`}
              onClick={() => executeSuggestion(suggestion)}
            >
              <div className="suggestion-content">
                {suggestion.type === 'product' && suggestion.image && (
                  <img src={suggestion.image} alt={suggestion.text} className="suggestion-image" />
                )}
                <div className="suggestion-text">
                  <div className="suggestion-main">
                    {highlightMatch(suggestion.text)}
                  </div>
                  {(suggestion.brand || suggestion.category) && (
                    <div className="suggestion-meta">
                      {suggestion.brand && <span>{suggestion.brand}</span>}
                      {suggestion.category && <span>{suggestion.category}</span>}
                    </div>
                  )}
                </div>
              </div>
              <div className="suggestion-type">
                {suggestion.type === 'product' && <span>Product</span>}
                {suggestion.type === 'category' && <span>Category</span>}
                {suggestion.type === 'brand' && <span>Brand</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {isLoading && (
        <div className="search-loading">
          <div className="search-spinner"></div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
