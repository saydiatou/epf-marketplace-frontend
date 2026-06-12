import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import { EmptyState } from '../../components/ui/EmptyState'
import { Button } from '../../components/ui/Button'

export default function PlaceholderPage({ title, description }) {
  return (
    <div className="container-app py-10">
      <EmptyState
        title={title}
        description={description}
        action={
          <Link to={ROUTES.HOME}>
            <Button variant="secondary">Accueil</Button>
          </Link>
        }
      />
    </div>
  )
}
