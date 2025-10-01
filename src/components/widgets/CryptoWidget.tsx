import { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Clock, Zap } from 'lucide-react';
import { BaseWidget } from './BaseWidget';
import { useCrypto } from '../../hooks/useCrypto';
import { cryptoService } from '../../services/api/crypto';

interface CryptoWidgetProps {
  initialLimit?: number;
  className?: string;
}

export function CryptoWidget({ initialLimit = 8, className }: CryptoWidgetProps) {
  const [limit, setLimit] = useState(initialLimit);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const { 
    coins, 
    isLoading, 
    error, 
    refresh, 
    lastUpdated,
    isStale,
    totalCoins
  } = useCrypto({ limit });

  // 📚 Handle limit change
  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setIsSettingsOpen(false);
  };

  // 📚 Handle settings toggle
  const handleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  // 📚 Get price change styling
  const getPriceChangeStyle = (change: number) => {
    if (change > 0) {
      return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
    } else if (change < 0) {
      return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
    }
    return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700';
  };

  return (
    <BaseWidget
      widgetId="crypto-widget"
      title="Crypto Prices"
      subtitle={`Top ${totalCoins} cryptocurrencies`}
      size="large"
      isLoading={isLoading}
      error={error}
      onRefresh={refresh}
      onSettings={handleSettings}
      className={className}
    >
      <div className="h-full flex flex-col min-h-0">
        
        {/* 📚 Settings Panel (limit selection) */}
        {isSettingsOpen && (
          <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg flex-shrink-0">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Number of Coins
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[4, 6, 8, 12].map((count) => (
                <button
                  key={count}
                  onClick={() => handleLimitChange(count)}
                  className={`px-3 py-2 text-sm rounded-lg font-medium transition-colors ${
                    limit === count
                      ? 'bg-blue-500 text-white'
                      : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-500'
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 📚 Crypto Coins Grid */}
        {coins && coins.length > 0 && !isSettingsOpen && (
          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {coins.map((coin) => (
                <div
                  key={coin.id}
                  className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 
                           hover:shadow-md dark:hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-600 
                           transition-all duration-200"
                >
                  {/* 📚 Coin Header */}
                  <div className="flex items-center gap-3 mb-2">
                    <img
                      src={coin.image}
                      alt={coin.name}
                      className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                        {coin.name}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 text-xs uppercase">
                        {coin.symbol}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        {cryptoService.formatPrice(coin.currentPrice)}
                      </div>
                    </div>
                  </div>

                  {/* 📚 Price Change */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {coin.priceChangePercentage24h > 0 ? (
                        <TrendingUp className="w-3 h-3 text-green-500" />
                      ) : coin.priceChangePercentage24h < 0 ? (
                        <TrendingDown className="w-3 h-3 text-red-500" />
                      ) : (
                        <DollarSign className="w-3 h-3 text-gray-400" />
                      )}
                      <span 
                        className={`text-xs font-medium px-2 py-1 rounded ${
                          getPriceChangeStyle(coin.priceChangePercentage24h)
                        }`}
                      >
                        {coin.priceChangePercentage24h > 0 ? '+' : ''}
                        {coin.priceChangePercentage24h.toFixed(2)}%
                      </span>
                    </div>
                    
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {cryptoService.formatMarketCap(coin.marketCap)}
                    </div>
                  </div>

                  {/* 📚 24h Change Amount */}
                  <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                    24h: {coin.priceChange24h > 0 ? '+' : ''}
                    {cryptoService.formatPrice(Math.abs(coin.priceChange24h))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 📚 Empty State */}
        {coins && coins.length === 0 && !isLoading && !error && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400 mb-2">No cryptocurrency data available</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm">
                Check your internet connection and try again
              </p>
            </div>
          </div>
        )}

        {/* 📚 Footer with API Info */}
        <div className="pt-3 mt-3 border-t border-gray-200 dark:border-gray-700">
          {/* Last Updated */}
          <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 mb-2">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Updated {lastUpdated}</span>
              {isStale && (
                <span className="ml-1 px-1.5 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 
                               text-yellow-700 dark:text-yellow-300 rounded text-xs">
                  Stale
                </span>
              )}
            </div>
          </div>

          {/* API Attribution */}
          <div className="flex items-center justify-center gap-1 text-xs text-gray-400 dark:text-gray-500">
            <Zap className="w-3 h-3" />
            <span>Powered by CoinGecko • Free API</span>
          </div>
        </div>
      </div>
    </BaseWidget>
  );
}