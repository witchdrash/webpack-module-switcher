# webpack-module-switcher
Experiment on switching modules, and basically anything else out on compile

Just a couple of spikes written to enable the switching out of files for a white label site based on Client and Brand, and to improve my understanding of the inner workins of webpack.

Webpack config loader section looks like:

new RebrandSwitcher({
	client: 123,
	brand: 987,
	matcher: /\.(png|jpg|jpeg|gif|svg)$/,
	root: "./Rebrand"
})

new SideBySideSwitcher({
	client: 123,
	brand: 987,
	matcher: /\.(html)$/
})

new SideBySideSwitcherTypeScript({
	client: 123,
	brand: 987
})

Rebrand Switcher changes files held in a different directory, they have to be called the same name e.g. main.scss => ./rebrand/main.scss

SideBySideSwitcher does the same but looks at the file name to switch main.scss => main.123.987.scss or main.123.scss or main.scss in that order

SideBySideSwitcherTypeScript does a side by side switch with typescript, because typescript references don't have a .ts on the end of the file, so this is very similar to the side by side by adds .ts before doing the file check
