import { Button } from './Button'

export function Pagination({ currentPage, lastPage, onPageChange }) {
  if (lastPage <= 1) return null

  const pages = Array.from({ length: lastPage }, (_, i) => i + 1)

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Button
        variant="secondary"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Précédent
      </Button>
      {pages.map((page) => (
        <Button
          key={page}
          variant={page === currentPage ? 'primary' : 'secondary'}
          onClick={() => onPageChange(page)}
        >
          {page}
        </Button>
      ))}
      <Button
        variant="secondary"
        disabled={currentPage >= lastPage}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Suivant
      </Button>
    </div>
  )
}
