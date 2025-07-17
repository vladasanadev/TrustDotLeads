import { cn } from '@/lib/utils'
import { formatNumber, formatCurrency } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    type: 'increase' | 'decrease'
  }
  icon?: React.ComponentType<{ className?: string }>
  className?: string
  valueType?: 'number' | 'currency' | 'percentage'
}

export default function StatsCard({
  title,
  value,
  change,
  icon: Icon,
  className,
  valueType = 'number'
}: StatsCardProps) {
  const formatValue = (val: string | number) => {
    if (typeof val === 'string') return val
    
    switch (valueType) {
      case 'currency':
        return formatCurrency(val)
      case 'percentage':
        return `${val}%`
      default:
        return formatNumber(val)
    }
  }

  return (
    <div className={cn('overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6', className)}>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          {Icon && <Icon className="h-8 w-8 text-gray-400" />}
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd className="flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900">
                {formatValue(value)}
              </div>
              {change && (
                <div
                  className={cn(
                    'ml-2 flex items-baseline text-sm font-semibold',
                    change.type === 'increase' ? 'text-green-600' : 'text-red-600'
                  )}
                >
                  {change.type === 'increase' ? '+' : '-'}
                  {change.value}%
                </div>
              )}
            </dd>
          </dl>
        </div>
      </div>
    </div>
  )
} 