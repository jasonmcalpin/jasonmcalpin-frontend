<?php
/**
 * Plugin Name: Bytes Custom Post Type
 * Description: Custom post type for bytes/articles with WPGraphQL support and auto reading time calculation
 * Version: 1.1.0
 * Author: Jason McAlpin
 */

if (!defined('ABSPATH')) {
    exit;
}

class BytesPostType {
    
    public function __construct() {
        add_action('init', array($this, 'register_post_type'));
        add_action('add_meta_boxes', array($this, 'add_meta_boxes'));
        add_action('save_post', array($this, 'save_meta_boxes'));
        add_action('graphql_register_types', array($this, 'register_graphql_fields'));
        
        add_action('after_setup_theme', array($this, 'add_theme_support'));
    }
    
    public function calculate_reading_time($content) {
        $word_count = str_word_count(strip_tags($content));
        
        $reading_time = max(1, round($word_count / 200));
        
        return $reading_time;
    }
    
    public function register_post_type() {
        $labels = array(
            'name'                  => 'Bytes',
            'singular_name'         => 'Byte',
            'menu_name'             => 'Bytes',
            'name_admin_bar'        => 'Byte',
            'archives'              => 'Byte Archives',
            'attributes'            => 'Byte Attributes',
            'parent_item_colon'     => 'Parent Byte:',
            'all_items'             => 'All Bytes',
            'add_new_item'          => 'Add New Byte',
            'add_new'               => 'Add New',
            'new_item'              => 'New Byte',
            'edit_item'             => 'Edit Byte',
            'update_item'           => 'Update Byte',
            'view_item'             => 'View Byte',
            'view_items'            => 'View Bytes',
            'search_items'          => 'Search Bytes',
            'not_found'             => 'Not found',
            'not_found_in_trash'    => 'Not found in Trash',
            'featured_image'        => 'Featured Image',
            'set_featured_image'    => 'Set featured image',
            'remove_featured_image' => 'Remove featured image',
            'use_featured_image'    => 'Use as featured image',
            'insert_into_item'      => 'Insert into byte',
            'uploaded_to_this_item' => 'Uploaded to this byte',
            'items_list'            => 'Bytes list',
            'items_list_navigation' => 'Bytes list navigation',
            'filter_items_list'     => 'Filter bytes list',
        );
        
        $args = array(
            'label'                 => 'Byte',
            'description'           => 'Bytes/Articles custom post type',
            'labels'                => $labels,
            'supports'              => array('title', 'editor', 'excerpt', 'thumbnail', 'revisions', 'custom-fields'),
            'taxonomies'            => array('technologies'),
            'hierarchical'          => false,
            'public'                => true,
            'show_ui'               => true,
            'show_in_menu'          => true,
            'menu_position'         => 5,
            'menu_icon'             => 'dashicons-admin-page',
            'show_in_admin_bar'     => true,
            'show_in_nav_menus'     => true,
            'can_export'            => true,
            'has_archive'           => true,
            'exclude_from_search'   => false,
            'publicly_queryable'    => true,
            'capability_type'       => 'post',
            'show_in_rest'          => true,
            'rest_base'             => 'bytes',
            'show_in_graphql'       => true,
            'graphql_single_name'   => 'byte',
            'graphql_plural_name'   => 'bytes',
        );
        
        register_post_type('bytes', $args);
    }
    
    public function add_meta_boxes() {
        add_meta_box(
            'bytes_meta_box',
            'Byte Details',
            array($this, 'meta_box_callback'),
            'bytes',
            'normal',
            'high'
        );
    }
    
    public function meta_box_callback($post) {
        wp_nonce_field('bytes_meta_box', 'bytes_meta_box_nonce');
        
        $reading_time = get_post_meta($post->ID, '_bytes_reading_time', true);
        $author = get_post_meta($post->ID, '_bytes_author', true);
        $image_url = get_post_meta($post->ID, '_bytes_image_url', true);
        
        if ($post->ID && !empty($post->post_content)) {
            $calculated_reading_time = $this->calculate_reading_time($post->post_content);
            $word_count = str_word_count(strip_tags($post->post_content));
        } else {
            $calculated_reading_time = 0;
            $word_count = 0;
        }
        
        if (empty($author)) {
            $current_user = wp_get_current_user();
            $author = $current_user->display_name;
        }
        
        ?>
        <table class="form-table">
            <tr>
                <th><label>Reading Time</label></th>
                <td>
                    <p><strong><?php echo $calculated_reading_time; ?> minute<?php echo $calculated_reading_time !== 1 ? 's' : ''; ?></strong> 
                       <span class="description">(Auto-calculated from <?php echo $word_count; ?> words at ~200 WPM)</span></p>
                    <label>
                        <input type="checkbox" id="bytes_manual_reading_time" name="bytes_manual_reading_time" 
                               value="1" <?php checked(!empty($reading_time)); ?> />
                        Override with manual reading time
                    </label>
                    <br><br>
                    <input type="number" id="bytes_reading_time" name="bytes_reading_time" 
                           value="<?php echo esc_attr($reading_time); ?>" min="1" max="999" 
                           style="<?php echo empty($reading_time) ? 'display:none;' : ''; ?>" />
                    <p class="description" id="manual_time_desc" style="<?php echo empty($reading_time) ? 'display:none;' : ''; ?>">
                        Manual reading time in minutes (overrides auto-calculation)
                    </p>
                </td>
            </tr>
            <tr>
                <th><label for="bytes_author">Author</label></th>
                <td>
                    <input type="text" id="bytes_author" name="bytes_author" 
                           value="<?php echo esc_attr($author); ?>" class="regular-text" />
                    <p class="description">Author name for this byte</p>
                </td>
            </tr>
            <tr>
                <th><label for="bytes_image_url">Image URL</label></th>
                <td>
                    <input type="url" id="bytes_image_url" name="bytes_image_url" 
                           value="<?php echo esc_attr($image_url); ?>" class="regular-text" />
                    <p class="description">URL for the byte featured image (optional - can use WordPress featured image instead)</p>
                </td>
            </tr>
        </table>
        
        <script>
        jQuery(document).ready(function($) {
            $('#bytes_manual_reading_time').change(function() {
                if ($(this).is(':checked')) {
                    $('#bytes_reading_time').show();
                    $('#manual_time_desc').show();
                } else {
                    $('#bytes_reading_time').hide().val('');
                    $('#manual_time_desc').hide();
                }
            });
        });
        </script>
        <?php
    }
    
    public function save_meta_boxes($post_id) {
        if (!isset($_POST['bytes_meta_box_nonce']) || 
            !wp_verify_nonce($_POST['bytes_meta_box_nonce'], 'bytes_meta_box')) {
            return;
        }
        
        if (!current_user_can('edit_post', $post_id)) {
            return;
        }
        
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }
        
        $post = get_post($post_id);
        
        if (isset($_POST['bytes_manual_reading_time']) && !empty($_POST['bytes_reading_time'])) {
            update_post_meta($post_id, '_bytes_reading_time', 
                sanitize_text_field($_POST['bytes_reading_time']));
        } else {
            if (!empty($post->post_content)) {
                $auto_reading_time = $this->calculate_reading_time($post->post_content);
                update_post_meta($post_id, '_bytes_reading_time', $auto_reading_time);
            }
        }
        
        if (isset($_POST['bytes_author'])) {
            update_post_meta($post_id, '_bytes_author', 
                sanitize_text_field($_POST['bytes_author']));
        }
        
        if (isset($_POST['bytes_image_url'])) {
            update_post_meta($post_id, '_bytes_image_url', 
                esc_url_raw($_POST['bytes_image_url']));
        }
    }
    

    public function register_graphql_fields() {
        if (!function_exists('register_graphql_field')) {
            return;
        }
        
        register_graphql_object_type('ByteFields', [
            'description' => 'Custom fields for bytes',
            'fields' => [
                'readingTime' => [
                    'type' => 'Int',
                    'description' => 'Reading time in minutes (auto-calculated or manual override)',
                ],
                'author' => [
                    'type' => 'String', 
                    'description' => 'Author name for this byte',
                ],
                'imageUrl' => [
                    'type' => 'String',
                    'description' => 'Custom image URL for this byte',
                ],
            ],
        ]);
        
        register_graphql_field('Byte', 'byteFields', [
            'type' => 'ByteFields',
            'description' => 'Custom fields for this byte',
            'resolve' => function($post) {
                $reading_time = get_post_meta($post->ID, '_bytes_reading_time', true);
                if (empty($reading_time)) {
                    $bytes_post_type = new BytesPostType();
                    $reading_time = $bytes_post_type->calculate_reading_time($post->post_content);
                }
                
                return [
                    'readingTime' => (int) $reading_time,
                    'author' => get_post_meta($post->ID, '_bytes_author', true) ?: 'Jason McAlpin',
                    'imageUrl' => get_post_meta($post->ID, '_bytes_image_url', true),
                ];
            }
        ]);
        
        register_graphql_field('Byte', 'finalImageUrl', [
            'type' => 'String',
            'description' => 'The final image URL to use (custom image URL or featured image)',
            'resolve' => function($post) {
                $custom_image = get_post_meta($post->ID, '_bytes_image_url', true);
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
        
        register_graphql_field('Byte', 'tagsArray', [
            'type' => ['list_of' => 'String'],
            'description' => 'Array of technology names attached to this byte',
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
        add_theme_support('post-thumbnails', array('bytes'));
    }
    
    public static function get_byte_json($post_id) {
        $post = get_post($post_id);
        if (!$post || $post->post_type !== 'bytes') {
            return null;
        }
        
        $reading_time = get_post_meta($post_id, '_bytes_reading_time', true);
        $author = get_post_meta($post_id, '_bytes_author', true);
        $custom_image = get_post_meta($post_id, '_bytes_image_url', true);
        
        if (empty($reading_time)) {
            $bytes_post_type = new BytesPostType();
            $reading_time = $bytes_post_type->calculate_reading_time($post->post_content);
        }
        
        $image_url = $custom_image;
        if (empty($image_url)) {
            $featured_image_id = get_post_thumbnail_id($post_id);
            if ($featured_image_id) {
                $image_url = wp_get_attachment_image_url($featured_image_id, 'full');
            }
        }
        
        $terms = get_the_terms($post_id, 'technologies');
        $tags = array();
        if (is_array($terms)) {
            $tags = array_map(function($term) {
                return $term->name;
            }, $terms);
        }
        
        return array(
            'id' => (string) $post_id,
            'title' => $post->post_title,
            'slug' => $post->post_name,
            'excerpt' => $post->post_excerpt ?: wp_trim_words($post->post_content, 30),
            'date' => get_the_date('Y-m-d', $post_id),
            'imageUrl' => $image_url ?: '',
            'author' => $author ?: 'Jason McAlpin',
            'tags' => $tags,
            'readingTime' => (int) $reading_time,
            'content' => $post->post_content
        );
    }
}

new BytesPostType();

register_activation_hook(__FILE__, 'flush_rewrite_rules');
register_deactivation_hook(__FILE__, 'flush_rewrite_rules');
