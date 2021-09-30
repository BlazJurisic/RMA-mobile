import React from 'react';

export function LoadingWrapper({ children }: { children: JSX.Element }) {
	const loadingState = React.useState(false);
	return (
		<LoadingContext.Provider value={loadingState}>
			{children}
		</LoadingContext.Provider>
	);
}

const LoadingContext = React.createContext<any[]>([]);

export function useLoadingContext() {
	return React.useContext(LoadingContext);
}
