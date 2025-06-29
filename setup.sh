#!/bin/bash

# Web3 Message Signer & Verifier - Setup Script
# This script automates the complete setup process for the project

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_step() {
    echo -e "${BLUE}📋 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${CYAN}ℹ️  $1${NC}"
}

print_header() {
    echo -e "${PURPLE}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║              Web3 Message Signer & Verifier                  ║"
    echo "║                     Setup Script                             ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check Node.js version
check_node_version() {
    if command_exists node; then
        NODE_VERSION=$(node --version | cut -d'v' -f2)
        MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1)
        if [ "$MAJOR_VERSION" -ge 18 ]; then
            print_success "Node.js version $NODE_VERSION detected"
            return 0
        else
            print_error "Node.js version 18+ required. Current version: $NODE_VERSION"
            return 1
        fi
    else
        print_error "Node.js not found. Please install Node.js 18+ from https://nodejs.org/"
        return 1
    fi
}

# Function to check npm
check_npm() {
    if command_exists npm; then
        NPM_VERSION=$(npm --version)
        print_success "npm version $NPM_VERSION detected"
        return 0
    else
        print_error "npm not found. Please install npm"
        return 1
    fi
}

# Function to check git
check_git() {
    if command_exists git; then
        GIT_VERSION=$(git --version | cut -d' ' -f3)
        print_success "Git version $GIT_VERSION detected"
        return 0
    else
        print_warning "Git not found. Some features may not work properly"
        return 1
    fi
}

# Function to create environment files
setup_environment_files() {
    print_step "Setting up environment files..."
    
    # Backend environment
    if [ ! -f "backend/.env" ]; then
        if [ -f "backend/.env.example" ]; then
            cp backend/.env.example backend/.env
            print_success "Created backend/.env from example"
        else
            print_warning "backend/.env.example not found, creating default backend/.env"
            cat > backend/.env << 'EOF'
# Environment Variables
PORT=3001
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
EOF
        fi
    else
        print_info "backend/.env already exists, skipping..."
    fi
    
    # Frontend environment
    if [ ! -f "frontend/.env" ]; then
        if [ -f "frontend/.env.example" ]; then
            cp frontend/.env.example frontend/.env
            print_success "Created frontend/.env from example"
        else
            print_warning "frontend/.env.example not found, creating default frontend/.env"
            cat > frontend/.env << 'EOF'
# Dynamic.xyz Environment ID
VITE_DYNAMIC_ENVIRONMENT_ID=your_dynamic_environment_id_here

# Backend API URL
VITE_API_BASE_URL=http://localhost:3001
EOF
        fi
    else
        print_info "frontend/.env already exists, skipping..."
    fi
    
    # Configure Dynamic.xyz Environment ID if provided
    if [ -n "$DYNAMIC_ENV_ID" ]; then
        print_step "Configuring Dynamic.xyz Environment ID..."
        
        # Update the frontend .env file with the provided Environment ID
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            sed -i '' "s/VITE_DYNAMIC_ENVIRONMENT_ID=.*/VITE_DYNAMIC_ENVIRONMENT_ID=$DYNAMIC_ENV_ID/" frontend/.env
        else
            # Linux
            sed -i "s/VITE_DYNAMIC_ENVIRONMENT_ID=.*/VITE_DYNAMIC_ENVIRONMENT_ID=$DYNAMIC_ENV_ID/" frontend/.env
        fi
        
        print_success "Dynamic.xyz Environment ID configured: $DYNAMIC_ENV_ID"
    fi
}

# Function to install dependencies
install_dependencies() {
    print_step "Installing dependencies..."
    
    # Install root dependencies
    print_info "Installing root workspace dependencies..."
    npm install
    
    # Install backend dependencies
    print_info "Installing backend dependencies..."
    cd backend
    npm install
    cd ..
    
    # Install frontend dependencies
    print_info "Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
    
    print_success "All dependencies installed successfully"
}

# Function to verify installation
verify_installation() {
    print_step "Verifying installation..."
    
    # Check if node_modules exist
    if [ -d "node_modules" ] && [ -d "backend/node_modules" ] && [ -d "frontend/node_modules" ]; then
        print_success "All node_modules directories found"
    else
        print_error "Some node_modules directories are missing"
        return 1
    fi
    
    # Test backend build
    print_info "Testing backend build..."
    cd backend
    if npm run build >/dev/null 2>&1; then
        print_success "Backend builds successfully"
    else
        print_warning "Backend build test failed - this might be normal for first setup"
    fi
    cd ..
    
    # Test frontend build
    print_info "Testing frontend type checking..."
    cd frontend
    if npx tsc --noEmit >/dev/null 2>&1; then
        print_success "Frontend TypeScript checks pass"
    else
        print_warning "Frontend TypeScript check failed - make sure to configure environment variables"
    fi
    cd ..
}

# Function to start the development servers
start_development_servers() {
    print_step "Starting development servers..."
    
    print_info "Starting both frontend and backend servers..."
    print_info "Frontend will be available at: http://localhost:5173"
    print_info "Backend will be available at: http://localhost:3001"
    print_info ""
    print_warning "Press Ctrl+C to stop the servers"
    
    # Start both servers using the existing npm script
    npm run dev
}

# Function to display setup completion info
display_completion_info() {
    echo -e "${GREEN}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                    Setup Complete! 🎉                         ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    
    if [ -z "$DYNAMIC_ENV_ID" ]; then
        echo -e "${CYAN}Next Steps:${NC}"
        echo "1. 🔧 Configure your Dynamic.xyz Environment ID:"
        echo "   - Visit https://app.dynamic.xyz/ and create/login to your account"
        echo "   - Create a new project or use existing one"
        echo "   - Copy your Environment ID from the dashboard"
        echo -e "   - Edit ${YELLOW}frontend/.env${NC} and replace 'your_dynamic_environment_id_here'"
        echo ""
        echo "2. 🚀 Start the development servers:"
        echo -e "   ${GREEN}npm run dev${NC}          # Start both frontend and backend"
        echo -e "   ${GREEN}npm run dev:backend${NC}  # Start only backend (port 3001)"
        echo -e "   ${GREEN}npm run dev:frontend${NC} # Start only frontend (port 5173)"
    else
        echo -e "${CYAN}Environment configured successfully!${NC}"
        echo ""
        echo "🚀 Development servers starting automatically..."
    fi
    
    echo ""
    echo "3. 🌐 Access the application:"
    echo "   - Frontend: http://localhost:5173"
    echo "   - Backend:  http://localhost:3001"
    echo ""
    echo "4. 🧪 Run tests (optional):"
    echo -e "   ${GREEN}npm test${NC}             # Run all tests"
    echo -e "   ${GREEN}npm run test:watch${NC}   # Run backend tests in watch mode"
    echo ""
    echo "5. 🐳 Docker deployment (optional):"
    echo -e "   ${GREEN}npm run docker:build${NC} # Build Docker images"
    echo -e "   ${GREEN}npm run docker:up${NC}    # Start with Docker Compose"
    echo ""
    echo -e "${PURPLE}📚 For more information, check the README.md file${NC}"
    echo -e "${PURPLE}🔗 Live Demo: https://web3-signer-verifier.vercel.app/${NC}"
}

# Function to handle errors
handle_error() {
    print_error "Setup failed! Please check the error messages above."
    echo ""
    echo "Common solutions:"
    echo "- Ensure Node.js 18+ is installed"
    echo "- Check your internet connection"
    echo "- Try running: npm cache clean --force"
    echo "- Delete node_modules folders and try again"
    echo ""
    echo "If problems persist, please check the README.md or create an issue."
    exit 1
}

# Main setup function
main() {
    # Parse command line arguments
    DYNAMIC_ENV_ID=""
    START_SERVERS=false
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --env-id=*)
                DYNAMIC_ENV_ID="${1#*=}"
                START_SERVERS=true
                shift
                ;;
            --env-id)
                DYNAMIC_ENV_ID="$2"
                START_SERVERS=true
                shift 2
                ;;
            --start)
                START_SERVERS=true
                shift
                ;;
            -h|--help)
                echo "Usage: $0 [OPTIONS]"
                echo ""
                echo "Options:"
                echo "  --env-id=ID    Set Dynamic.xyz Environment ID and start servers"
                echo "  --env-id ID    Set Dynamic.xyz Environment ID and start servers"
                echo "  --start        Start development servers after setup"
                echo "  -h, --help     Show this help message"
                echo ""
                echo "Examples:"
                echo "  $0                                    # Setup only"
                echo "  $0 --env-id=your_environment_id      # Setup with env ID and start"
                echo "  $0 --start                            # Setup and start servers"
                exit 0
                ;;
            *)
                print_error "Unknown option: $1"
                echo "Use --help for usage information"
                exit 1
                ;;
        esac
    done
    
    # Set error handler
    trap handle_error ERR
    
    print_header
    
    # Check prerequisites
    print_step "Checking prerequisites..."
    check_node_version || exit 1
    check_npm || exit 1
    check_git
    
    echo ""
    
    # Setup environment files
    setup_environment_files
    
    echo ""
    
    # Install dependencies
    install_dependencies
    
    echo ""
    
    # Verify installation
    verify_installation
    
    echo ""
    
    # Display completion info
    display_completion_info
    
    # Start servers if requested
    if [ "$START_SERVERS" = true ]; then
        echo ""
        sleep 2  # Give user time to read the completion info
        start_development_servers
    fi
}

# Check if script is run from the correct directory
if [ ! -f "package.json" ] || [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    print_error "Please run this script from the project root directory"
    print_info "Usage: $0 [--env-id=YOUR_DYNAMIC_ENV_ID] [--start]"
    exit 1
fi

# Run main function with all arguments
main "$@"
