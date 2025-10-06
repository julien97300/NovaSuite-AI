#!/bin/bash

# Script de démarrage NovaSuite AI
# Ce script permet de démarrer facilement l'application en mode production ou développement

set -e

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
print_message() {
    echo -e "${BLUE}[NovaSuite AI]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Fonction d'aide
show_help() {
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  start, up          Démarrer NovaSuite AI en mode production"
    echo "  dev                Démarrer en mode développement"
    echo "  stop, down         Arrêter tous les services"
    echo "  restart            Redémarrer tous les services"
    echo "  logs               Afficher les logs"
    echo "  status             Afficher le statut des services"
    echo "  clean              Nettoyer les volumes et images"
    echo "  update             Mettre à jour et redémarrer"
    echo "  backup             Sauvegarder la base de données"
    echo "  restore [file]     Restaurer la base de données"
    echo "  help, -h, --help   Afficher cette aide"
    echo ""
    echo "Exemples:"
    echo "  $0 start           # Démarrer en production"
    echo "  $0 dev             # Démarrer en développement"
    echo "  $0 logs backend    # Voir les logs du backend"
    echo "  $0 backup          # Sauvegarder la DB"
}

# Vérifier que Docker est installé
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker n'est pas installé. Veuillez l'installer d'abord."
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose n'est pas installé. Veuillez l'installer d'abord."
        exit 1
    fi
}

# Vérifier les variables d'environnement
check_env() {
    if [ ! -f .env ]; then
        print_warning "Fichier .env non trouvé. Création d'un fichier par défaut..."
        cat > .env << EOF
# Configuration NovaSuite AI
OPENAI_API_KEY=your_openai_api_key_here
COMPOSE_PROJECT_NAME=novasuite
EOF
        print_success "Fichier .env créé. Veuillez le modifier avec vos paramètres."
    fi
}

# Démarrer en mode production
start_production() {
    print_message "Démarrage de NovaSuite AI en mode production..."
    check_env
    docker-compose up -d
    print_success "NovaSuite AI démarré en mode production"
    print_message "Application disponible sur: http://localhost"
    print_message "API disponible sur: http://localhost/api"
    print_message "OnlyOffice disponible sur: http://localhost/onlyoffice"
}

# Démarrer en mode développement
start_development() {
    print_message "Démarrage de NovaSuite AI en mode développement..."
    check_env
    docker-compose -f docker-compose.dev.yml up -d
    print_success "Services de développement démarrés"
    print_message "Base de données: localhost:5432"
    print_message "MinIO: localhost:9000 (console: localhost:9001)"
    print_message "OnlyOffice: localhost:8080"
    print_message ""
    print_message "Pour démarrer le frontend en développement:"
    print_message "cd frontend && npm run dev"
    print_message ""
    print_message "Le backend est disponible sur: http://localhost:5000"
}

# Arrêter les services
stop_services() {
    print_message "Arrêt des services NovaSuite AI..."
    docker-compose down
    docker-compose -f docker-compose.dev.yml down 2>/dev/null || true
    print_success "Services arrêtés"
}

# Redémarrer les services
restart_services() {
    print_message "Redémarrage des services..."
    stop_services
    sleep 2
    start_production
}

# Afficher les logs
show_logs() {
    if [ -n "$2" ]; then
        docker-compose logs -f "$2"
    else
        docker-compose logs -f
    fi
}

# Afficher le statut
show_status() {
    print_message "Statut des services NovaSuite AI:"
    docker-compose ps
}

# Nettoyer les volumes et images
clean_all() {
    print_warning "Cette action va supprimer tous les volumes et données. Continuer? (y/N)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        print_message "Nettoyage en cours..."
        docker-compose down -v
        docker-compose -f docker-compose.dev.yml down -v 2>/dev/null || true
        docker system prune -f
        print_success "Nettoyage terminé"
    else
        print_message "Nettoyage annulé"
    fi
}

# Mettre à jour
update_services() {
    print_message "Mise à jour de NovaSuite AI..."
    docker-compose pull
    docker-compose build --no-cache
    restart_services
    print_success "Mise à jour terminée"
}

# Sauvegarder la base de données
backup_database() {
    print_message "Sauvegarde de la base de données..."
    BACKUP_FILE="backup_$(date +%Y%m%d_%H%M%S).sql"
    docker-compose exec postgres pg_dump -U admin novasuite > "$BACKUP_FILE"
    print_success "Sauvegarde créée: $BACKUP_FILE"
}

# Restaurer la base de données
restore_database() {
    if [ -z "$2" ]; then
        print_error "Veuillez spécifier le fichier de sauvegarde"
        exit 1
    fi
    
    if [ ! -f "$2" ]; then
        print_error "Fichier de sauvegarde non trouvé: $2"
        exit 1
    fi
    
    print_warning "Cette action va écraser la base de données actuelle. Continuer? (y/N)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        print_message "Restauration en cours..."
        docker-compose exec -T postgres psql -U admin -d novasuite < "$2"
        print_success "Restauration terminée"
    else
        print_message "Restauration annulée"
    fi
}

# Script principal
main() {
    check_docker
    
    case "${1:-start}" in
        start|up)
            start_production
            ;;
        dev|development)
            start_development
            ;;
        stop|down)
            stop_services
            ;;
        restart)
            restart_services
            ;;
        logs)
            show_logs "$@"
            ;;
        status|ps)
            show_status
            ;;
        clean)
            clean_all
            ;;
        update)
            update_services
            ;;
        backup)
            backup_database
            ;;
        restore)
            restore_database "$@"
            ;;
        help|-h|--help)
            show_help
            ;;
        *)
            print_error "Option inconnue: $1"
            show_help
            exit 1
            ;;
    esac
}

# Exécuter le script principal
main "$@"
