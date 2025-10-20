<?php
/**
 * Plugin Name: Projects Custom Post Type
 * Description: Custom post type for projects with WPGraphQL support
 * Version: 1.0.0
 * Author: Jason McAlpin
 */

if (!defined('ABSPATH')) {
    exit;
}

class ProjectsPostType {
    
    public function __construct() {
        add_action('init', array($this, 'register_post_type'));
        add_action('add_meta_boxes', array($this, 'add_meta_boxes'));
        add_action('save_post', array($this, 'save_meta_boxes'));
        add_action('graphql_register_types', array($this, 'register_graphql_fields'));
        
        add_action('after_setup_theme', array($this, 'add_theme_support'));
    }
    
    public function register_post_type() {
        $labels = array(
            'name'                  => 'Projects',
            'singular_name'         => 'Project',
            'menu_name'             => 'Projects',
            'name_admin_bar'        => 'Project',
            'archives'              => 'Project Archives',
            'attributes'            => 'Project Attributes',
            'parent_item_colon'     => 'Parent Project:',
            'all_items'             => 'All Projects',
            'add_new_item'          => 'Add New Project',
            'add_new'               => 'Add New',
            'new_item'              => 'New Project',
            'edit_item'             => 'Edit Project',
            'update_item'           => 'Update Project',
            'view_item'             => 'View Project',
            'view_items'            => 'View Projects',
            'search_items'          => 'Search Projects',
            'not_found'             => 'Not found',
            'not_found_in_trash'    => 'Not found in Trash',
            'featured_image'        => 'Featured Image',
            'set_featured_image'    => 'Set featured image',
            'remove_featured_image' => 'Remove featured image',
            'use_featured_image'    => 'Use as featured image',
            'insert_into_item'      => 'Insert into project',
            'uploaded_to_this_item' => 'Uploaded to this project',
            'items_list'            => 'Projects list',
            'items_list_navigation' => 'Projects list navigation',
            'filter_items_list'     => 'Filter projects list',
        );
        
        $args = array(
            'label'                 => 'Project',
            'description'           => 'Projects custom post type',
            'labels'                => $labels,
            'supports'              => array('title', 'editor', 'thumbnail', 'revisions', 'custom-fields'),
            'taxonomies'            => array('technologies'),
            'hierarchical'          => false,
            'public'                => true,
            'show_ui'               => true,
            'show_in_menu'          => true,
            'menu_position'         => 6,
            'menu_icon'             => 'dashicons-portfolio',
            'show_in_admin_bar'     => true,
            'show_in_nav_menus'     => true,
            'can_export'            => true,
            'has_archive'           => true,
            'exclude_from_search'   => false,
            'publicly_queryable'    => true,
            'capability_type'       => 'post',
            'show_in_rest'          => true,
            'rest_base'             => 'projects',
            'show_in_graphql'       => true,
            'graphql_single_name'   => 'project',
            'graphql_plural_name'   => 'projects',
        );
        
        register_post_type('projects', $args);
    }
    
    public function add_meta_boxes() {
        add_meta_box(
            'projects_meta_box',
            'Project Details',
            array($this, 'meta_box_callback'),
            'projects',
            'normal',
            'high'
        );
    }
    
    public function meta_box_callback($post) {
        wp_nonce_field('projects_meta_box', 'projects_meta_box_nonce');
        
        $description = get_post_meta($post->ID, '_projects_description', true);
        $image_url = get_post_meta($post->ID, '_projects_image_url', true);
        $live_url = get_post_meta($post->ID, '_projects_live_url', true);
        $github_url = get_post_meta($post->ID, '_projects_github_url', true);
        $featured = get_post_meta($post->ID, '_projects_featured', true);
        
        ?>
        <table class="form-table">
            <tr>
                <th><label for="projects_description">Description</label></th>
                <td>
                    <textarea id="projects_description" name="projects_description" 
                              rows="4" class="large-text"><?php echo esc_textarea($description); ?></textarea>
                    <p class="description">Brief description of the project</p>
                </td>
            </tr>
            <tr>
                <th><label for="projects_image_url">Image URL</label></th>
                <td>
                    <input type="url" id="projects_image_url" name="projects_image_url" 
                           value="<?php echo esc_attr($image_url); ?>" class="regular-text" />
                    <p class="description">URL for the project image (optional - can use WordPress featured image instead)</p>
                </td>
            </tr>
            <tr>
                <th><label for="projects_live_url">Live URL</label></th>
                <td>
                    <input type="url" id="projects_live_url" name="projects_live_url" 
                           value="<?php echo esc_attr($live_url); ?>" class="regular-text" />
                    <p class="description">URL to the live project/demo (optional)</p>
                </td>
            </tr>
            <tr>
                <th><label for="projects_github_url">GitHub URL</label></th>
                <td>
                    <input type="url" id="projects_github_url" name="projects_github_url" 
                           value="<?php echo esc_attr($github_url); ?>" class="regular-text" />
                    <p class="description">URL to the GitHub repository (optional)</p>
                </td>
            </tr>
            <tr>
                <th><label for="projects_featured">Featured Project</label></th>
                <td>
                    <label>
                        <input type="checkbox" id="projects_featured" name="projects_featured" 
                               value="1" <?php checked($featured, '1'); ?> />
                        Mark this project as featured
                    </label>
                    <p class="description">Featured projects will be highlighted in listings</p>
                </td>
            </tr>
        </table>
        <?php
    }
    
    public function save_meta_boxes($post_id) {
        if (!isset($_POST['projects_meta_box_nonce']) || 
            !wp_verify_nonce($_POST['projects_meta_box_nonce'], 'projects_meta_box')) {
            return;
        }
        
        if (!current_user_can('edit_post', $post_id)) {
            return;
        }
        
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }
        
        if (isset($_POST['projects_description'])) {
            update_post_meta($post_id, '_projects_description', 
                sanitize_textarea_field($_POST['projects_description']));
        }
        
        if (isset($_POST['projects_image_url'])) {
            update_post_meta($post_id, '_projects_image_url', 
                esc_url_raw($_POST['projects_image_url']));
        }
        
        if (isset($_POST['projects_live_url'])) {
            update_post_meta($post_id, '_projects_live_url', 
                esc_url_raw($_POST['projects_live_url']));
        }
        
        if (isset($_POST['projects_github_url'])) {
            update_post_meta($post_id, '_projects_github_url', 
                esc_url_raw($_POST['projects_github_url']));
        }
        
        $featured = isset($_POST['projects_featured']) ? '1' : '0';
        update_post_meta($post_id, '_projects_featured', $featured);
    }
    
    public function register_graphql_fields() {
        if (!function_exists('register_graphql_field')) {
            return;
        }
        
        register_graphql_object_type('ProjectFields', [
            'description' => 'Custom fields for projects',
            'fields' => [
                'description' => [
                    'type' => 'String',
                    'description' => 'Project description',
                ],
                'imageUrl' => [
                    'type' => 'String',
                    'description' => 'Custom image URL for this project',
                ],
                'liveUrl' => [
                    'type' => 'String',
                    'description' => 'URL to the live project/demo',
                ],
                'githubUrl' => [
                    'type' => 'String',
                    'description' => 'URL to the GitHub repository',
                ],
                'featured' => [
                    'type' => 'Boolean',
                    'description' => 'Whether this project is featured',
                ],
            ],
        ]);
        
        register_graphql_field('Project', 'projectFields', [
            'type' => 'ProjectFields',
            'description' => 'Custom fields for this project',
            'resolve' => function($post) {
                return [
                    'description' => get_post_meta($post->ID, '_projects_description', true),
                    'imageUrl' => get_post_meta($post->ID, '_projects_image_url', true),
                    'liveUrl' => get_post_meta($post->ID, '_projects_live_url', true),
                    'githubUrl' => get_post_meta($post->ID, '_projects_github_url', true),
                    'featured' => get_post_meta($post->ID, '_projects_featured', true) === '1',
                ];
            }
        ]);
        
        register_graphql_field('Project', 'finalImageUrl', [
            'type' => 'String',
            'description' => 'The final image URL to use (custom image URL or featured image)',
            'resolve' => function($post) {
                $custom_image = get_post_meta($post->ID, '_projects_image_url', true);
                if (!empty($custom_image)) {
                    return $custom_image;
                }
                
                $featured_image_id = get_post_thumbnail_id($post->ID);
                if ($featured_image_id) {
                    return wp_get_attachment_image_url($featured_image_id, 'full');
                }
                
                return null;
            }
        ]);
        
        register_graphql_field('Project', 'technologiesArray', [
            'type' => ['list_of' => 'String'],
            'description' => 'Array of technology names used in this project',
            'resolve' => function($post) {
                $terms = get_the_terms($post->ID, 'technologies');
                if (is_array($terms)) {
                    return array_map(function($term) {
                        return $term->name;
                    }, $terms);
                }
                return [];
            }
        ]);
    }
    
    public function add_theme_support() {
        add_theme_support('post-thumbnails', array('projects'));
    }
    
    public static function get_project_json($post_id) {
        $post = get_post($post_id);
        if (!$post || $post->post_type !== 'projects') {
            return null;
        }
        
        $description = get_post_meta($post_id, '_projects_description', true);
        $custom_image = get_post_meta($post_id, '_projects_image_url', true);
        $live_url = get_post_meta($post_id, '_projects_live_url', true);
        $github_url = get_post_meta($post_id, '_projects_github_url', true);
        $featured = get_post_meta($post_id, '_projects_featured', true) === '1';
        
        $image_url = $custom_image;
        if (empty($image_url)) {
            $featured_image_id = get_post_thumbnail_id($post_id);
            if ($featured_image_id) {
                $image_url = wp_get_attachment_image_url($featured_image_id, 'full');
            }
        }
        
        $terms = get_the_terms($post_id, 'technologies');
        $technologies = array();
        if (is_array($terms)) {
            $technologies = array_map(function($term) {
                return $term->name;
            }, $terms);
        }
        
        $project_data = array(
            'id' => (string) $post_id,
            'slug' => $post->post_name,
            'title' => $post->post_title,
            'description' => $description ?: $post->post_content,
            'imageUrl' => $image_url ?: '',
            'technologies' => $technologies,
            'featured' => $featured
        );
        
        if (!empty($live_url)) {
            $project_data['liveUrl'] = $live_url;
        }
        
        if (!empty($github_url)) {
            $project_data['githubUrl'] = $github_url;
        }
        
        return $project_data;
    }
    
    public function add_admin_columns($columns) {
        $columns['featured'] = 'Featured';
        $columns['live_url'] = 'Live URL';
        $columns['github_url'] = 'GitHub URL';
        return $columns;
    }
    
    public function display_admin_columns($column, $post_id) {
        switch ($column) {
            case 'featured':
                $featured = get_post_meta($post_id, '_projects_featured', true);
                echo $featured === '1' ? '⭐ Yes' : 'No';
                break;
            case 'live_url':
                $live_url = get_post_meta($post_id, '_projects_live_url', true);
                if (!empty($live_url)) {
                    echo '<a href="' . esc_url($live_url) . '" target="_blank">View Live</a>';
                } else {
                    echo '—';
                }
                break;
            case 'github_url':
                $github_url = get_post_meta($post_id, '_projects_github_url', true);
                if (!empty($github_url)) {
                    echo '<a href="' . esc_url($github_url) . '" target="_blank">GitHub</a>';
                } else {
                    echo '—';
                }
                break;
        }
    }
}

$projects_post_type = new ProjectsPostType();

add_filter('manage_projects_posts_columns', array($projects_post_type, 'add_admin_columns'));
add_action('manage_projects_posts_custom_column', array($projects_post_type, 'display_admin_columns'), 10, 2);

register_activation_hook(__FILE__, 'flush_rewrite_rules');
register_deactivation_hook(__FILE__, 'flush_rewrite_rules');
