import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { AnchorButton } from '@blueprintjs/core';
import { usePageContext } from 'client/utils/hooks';

require('./scopeNav.scss');

const propTypes = {
	navItems: PropTypes.array.isRequired,
};

const ScopeNav = function(props) {
	const { navItems } = props;
	const { locationData } = usePageContext();
	const { slug, mode, subMode } = locationData.params;
	const activeModeData = navItems.find((item) => item.slug === mode);
	const activeChildren = activeModeData.children;
	return (
		<div className="scope-nav-component">
			<div className="primary">
				{navItems.map((item) => {
					const { slug: modeSlug, title } = item;
					const isActive = mode === modeSlug;
					return (
						<AnchorButton
							className={classNames(isActive && 'active')}
							minimal
							large
							key={modeSlug}
							href={`/${slug}/${modeSlug}`}
							text={title}
						/>
					);
				})}
			</div>
			{activeChildren && (
				<div className="secondary">
					{activeChildren.map((item) => {
						const { slug: subModeSlug, title } = item;
						const isActive = subMode === subModeSlug;
						const { slug: modeSlug } = activeModeData;
						return (
							<AnchorButton
								className={classNames(isActive && 'active')}
								minimal
								small
								key={subModeSlug}
								href={`/${slug}/${modeSlug}/${subModeSlug}`}
								text={title}
							/>
						);
					})}
				</div>
			)}
		</div>
	);
};

ScopeNav.propTypes = propTypes;
export default ScopeNav;
