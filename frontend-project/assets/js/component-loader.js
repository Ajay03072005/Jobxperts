/**
 * Component Loader Utility
 * Provides functions to dynamically load HTML components
 */

class ComponentLoader {
    /**
     * Load a component into a container element
     * @param {string} componentPath - Path to the component HTML file
     * @param {string} containerId - ID of the container element
     * @param {Function} callback - Optional callback function after loading
     */
    static async loadComponent(componentPath, containerId, callback = null) {
        try {
            const response = await fetch(componentPath);
            if (!response.ok) {
                throw new Error(`Failed to load component: ${response.status}`);
            }
            
            const componentHTML = await response.text();
            const container = document.getElementById(containerId);
            
            if (!container) {
                throw new Error(`Container element with ID '${containerId}' not found`);
            }
            
            container.innerHTML = componentHTML;
            
            // Execute callback if provided
            if (callback && typeof callback === 'function') {
                callback();
            }
            
            console.log(`Component loaded successfully: ${componentPath}`);
        } catch (error) {
            console.error('Error loading component:', error);
            // Optionally show user-friendly error message
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = '<div class="component-error">Failed to load component</div>';
            }
        }
    }

    /**
     * Load the navigation component
     * @param {string} containerId - ID of the container element (default: 'navbar-container')
     * @param {Function} callback - Optional callback function after loading
     */
    static loadNavigation(containerId = 'navbar-container', callback = null) {
        const navPath = '../components/navbar.html';
        this.loadComponent(navPath, containerId, callback);
    }

    /**
     * Load multiple components
     * @param {Array} components - Array of component objects with {path, containerId, callback}
     */
    static async loadMultipleComponents(components) {
        const loadPromises = components.map(component => 
            this.loadComponent(component.path, component.containerId, component.callback)
        );
        
        try {
            await Promise.all(loadPromises);
            console.log('All components loaded successfully');
        } catch (error) {
            console.error('Error loading some components:', error);
        }
    }
}

// Auto-load navigation if navbar-container exists
document.addEventListener('DOMContentLoaded', function() {
    const navContainer = document.getElementById('navbar-container');
    if (navContainer) {
        ComponentLoader.loadNavigation();
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ComponentLoader;
}
