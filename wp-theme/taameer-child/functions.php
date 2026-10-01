<?php
/**
 * Taameer Plus child theme — SPIKE skeleton (Phase 4 spike).
 * Enqueues the four shipped front-end files after Elementor's styles. Nothing else except the marked SPIKE block.
 */

defined( 'ABSPATH' ) || exit;

add_action(
	'wp_enqueue_scripts',
	function () {
		$dir = get_stylesheet_directory();
		$uri = get_stylesheet_directory_uri();
		// Priority 20 + dependencies: Elementor registers its kit/post CSS at default priority; we load after.
		$css_deps = array( 'hello-elementor', 'elementor-frontend' );

		wp_enqueue_style( 'tp-animations', $uri . '/assets/css/animations.css', $css_deps, filemtime( $dir . '/assets/css/animations.css' ) );
		wp_enqueue_style( 'tp-theme', $uri . '/assets/css/theme.css', array_merge( $css_deps, array( 'tp-animations' ) ), filemtime( $dir . '/assets/css/theme.css' ) );
		wp_enqueue_script( 'tp-animations', $uri . '/assets/js/animations.js', array(), filemtime( $dir . '/assets/js/animations.js' ), array( 'strategy' => 'defer' ) );
		wp_enqueue_script( 'tp-interactions', $uri . '/assets/js/interactions.js', array(), filemtime( $dir . '/assets/js/interactions.js' ), array( 'strategy' => 'defer' ) );
	},
	20
);

/* SPIKE START — check 3 (atomic Loop): throwaway CPT. Remove this whole block (and delete the posts) after the spike. */
add_action(
	'init',
	function () {
		register_post_type(
			'tp_spike_project',
			array(
				'label'        => 'Spike Projects',
				'public'       => true,
				'show_in_rest' => true,
				'supports'     => array( 'title', 'editor', 'thumbnail', 'excerpt' ),
			)
		);
	}
);
/* SPIKE END */
