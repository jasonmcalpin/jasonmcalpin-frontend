<?php
/**
 * Plugin Name: Technologies Taxonomy
 * Description: Custom taxonomy for technologies that can be attached to bytes and projects
 * Version: 1.0.0
 * Author: Jason McAlpin
 */

if (!defined('ABSPATH')) {
    exit;
}

class TechnologiesTaxonomy {
    public function __construct() {
        add_action('init', array($this, 'register_taxonomy'));
        add_action('graphql_register_types', array($this, 'register_graphql_fields'));
    }
    
    public function register_taxonomy() {
        $labels = array(
            'name'                       => 'Technologies',
            'singular_name'             => 'Technology',
            'menu_name'                 => 'Technologies',
            'all_items'                 => 'All Technologies',
            'parent_item'               => 'Parent Technology',
            'parent_item_colon'         => 'Parent Technology:',
            'new_item_name'             => 'New Technology Name',
            'add_new_item'              => 'Add New Technology',
            'edit_item'                 => 'Edit Technology',
            'update_item'               => 'Update Technology',
            'view_item'                 => 'View Technology',
            'separate_items_with_commas' => 'Separate technologies with commas',
            'add_or_remove_items'       => 'Add or remove technologies',
            'choose_from_most_used'     => 'Choose from the most used technologies',
            'popular_items'             => 'Popular Technologies',
            'search_items'              => 'Search Technologies',
            'not_found'                 => 'Not Found',
            'no_terms'                  => 'No technologies',
            'items_list'                => 'Technologies list',
            'items_list_navigation'     => 'Technologies list navigation',
        );
        
        $args = array(
            'labels'                     => $labels,
            'hierarchical'               => false,
            'public'                     => true,
            'show_ui'                    => true,
            'show_admin_column'          => true,
            'show_in_nav_menus'          => true,
            'show_tagcloud'              => true,
            'show_in_rest'               => true,
            'show_in_graphql'            => true,
            'graphql_single_name'        => 'technology',
            'graphql_plural_name'        => 'technologies',
            'rest_base'                  => 'technologies',
        );
        
        register_taxonomy('technologies', array('bytes', 'projects'), $args);
    }
    
  
    public function register_graphql_fields() {
        if (!function_exists('register_graphql_field')) {
            return;
        }
        
        register_graphql_field('Technology', 'usage_count', [
            'type' => 'Int',
            'description' => 'Number of times this technology is used across bytes and projects',
            'resolve' => function($term) {
                return wp_count_terms(array(
                    'taxonomy' => 'technologies',
                    'include' => array($term->term_id)
                ));
            }
        ]);
    }
    

    public function get_all_technologies() {
        $terms = get_terms(array(
            'taxonomy' => 'technologies',
            'hide_empty' => false,
        ));
        
        $technologies = array();
        if (!is_wp_error($terms)) {
            foreach ($terms as $term) {
                $technologies[] = array(
                    'id' => $term->term_id,
                    'name' => $term->name,
                    'slug' => $term->slug,
                    'count' => $term->count
                );
            }
        }
        
        return $technologies;
    }
    

    public function populate_from_existing_data() {
        // Technologies from existing projects to seed the tax
        $existing_technologies = array(
            'React', 'TypeScript', 'Redux', 'SCSS', 'JavaScript', 'REST-API', 
            'Firebase', 'IBM Watson', 'Python', 'MySQL', 'Angular', 'Machine Learning',
            'JQuery', 'BrightCove', 'Express', 'Node.js', 'Adobe Target', 'WordPress',
            'PHP', 'SQL', 'JWT', 'SSO', 'Docker', 'Git', 'SASS', 'Cloudflare',
            'Vue.js', 'Vuex', 'Next.js', 'Carbon Framework', 'Adobe Experience Manager',
            'Teamwork', 'Leadership', 'Motivation', 'Productivity', 'Quality', 
            'Development', 'Web Development', 'Performance', 'Optimization',
            'Programming', 'Goals', 'Hooks', 'Learning', 'Career', 'Software Engineering',
            'Code Review', 'Quality Assurance', 'Foundations', 'Architecture', 
            'Microservices', 'Sockets', 'Networking', 'WebSockets', 'AI', 
            'Data Science', 'Vibe Coding', 'CI/CD', 'GitHub Actions', 'DevOps',
            'Husky', 'Linting', 'Testing', 'BDD', 'TDD', 'Frontend Development',
            'State Management', 'Fragments', 'Provider Pattern', 'Virtual DOM',
            'Jest', 'Cypress', 'Playwright'
        );
        
        foreach ($existing_technologies as $tech) {
            if (!term_exists($tech, 'technologies')) {
                wp_insert_term($tech, 'technologies');
            }
        }
    }
}

new TechnologiesTaxonomy();

register_activation_hook(__FILE__, function() {
    $tech_taxonomy = new TechnologiesTaxonomy();
    $tech_taxonomy->populate_from_existing_data();
    flush_rewrite_rules();
});

register_deactivation_hook(__FILE__, 'flush_rewrite_rules');
