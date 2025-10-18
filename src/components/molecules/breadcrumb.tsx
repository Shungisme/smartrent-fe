import React from 'react'

type BreadcrumbProps = {
  items: { label: string; href?: string }[]
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className='flex items-center space-x-2 text-sm text-gray-600 mb-6'>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span className='text-gray-400'>/</span>}
          <span
            className={
              index === items.length - 1
                ? 'font-medium text-gray-900'
                : 'hover:text-gray-900'
            }
          >
            {item.label}
          </span>
        </React.Fragment>
      ))}
    </nav>
  )
}

export default Breadcrumb
