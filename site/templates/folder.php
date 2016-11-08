<?php
$item = $page;
if(!kirby()->request()->ajax()) {
	$story = $item->parent();
	snippet( 'head', array( 
		'bodyClass' => array ( 'looking', 'story' ),
		'story' => $story,
		'item' => $item
	) );
	echo '<main>';
	snippet( 'table', array( 'story' => $story ) );
	snippet( 'footnotes' );
	echo '<div id="single" class="show open folder" data-item="' . $item->slug() . '" data-title="' . $item->title() . '" data-url="' . $item->url() . '">';
} else {
	echo '<div class="data" data-item="' . $item->slug() . '" data-title="' . $item->title() . '" data-url="' . $item->url() . '"></div>';
}
$images = $item->images();
echo '<section id="left">';
	echo '<div id="handle" class="ui-resizable-handle ui-resizable-e"><div class="line"></div></div>';
	echo '<div class="scroll">';
		echo '<div class="inner">';
			echo '<div class="items">';
				echo '<div class="itemsWrap">';
					foreach( $images->filterBy( 'thumb', '!=', 'false' ) as $index => $image ) {
						echo '<div class="item image" data-index="' . $index . '">';
							echo '<div class="itemWrap">';
								echo '<img src="' . $image->url() . '"/>';
								echo '<div class="caption text">';
									echo $image->caption()->kirbytext();
								echo '</div>';
							echo '</div>';
						echo '</div>';
					}
				echo '</div>';
			echo '</div>';
		echo '</div>';
	echo '</div>';
echo '</section>';
echo '<section id="right">';
	echo '<div class="scroll">';
		echo '<div class="inner">';
			echo '<div class="intro text">';
				echo $item->text()->kirbytext();
			echo '</div>';
		echo '</div>';
	echo '</div>';
echo '</section>';

if(!kirby()->request()->ajax()) {
	echo '</div>';
	echo '</main>';
	snippet('footer');
}
?>