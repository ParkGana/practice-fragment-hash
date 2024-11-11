const ROUTE_PARAMETER_REGEXP = /:(\w+)/g; // :name, :song등 path parameters를 매칭하기 위한 정규표현식
const URL_REGEXP = '([^\\/]+)';

export default function createRouter() {
    // 애플리케이션의 경로 목록을 담을 배열
    const routes = [];

    const router = {
        /* 애플리케이션의 경로 저장 */
        addRoute(fragment, component) {
            const params = [];

            const parsedFragment = fragment
                .replace(ROUTE_PARAMETER_REGEXP, (_, paramName) => {
                    // path parameter 추출
                    params.push(paramName);

                    // path parameter에 매치되는 문자를 URL_REGEXP로 치환
                    return URL_REGEXP;
                })
                // "/"를 텍스트로 사용하기 위해서 모든 "/" 앞에 "\"를 추가
                .replace(/\//g, '\\/');

            routes.push({
                fragmentRegExp: new RegExp(`^${parsedFragment}$`),
                component,
                params
            });

            return this;
        },

        /* url 변경 시 페이지 컨텐츠를 해당 url에 매핑된 구성요소로 교체 */
        start() {
            const getUrlParams = (route, hash) => {
                const params = {};

                const matches = hash.match(route.fragmentRegExp);

                // 배열의 첫 번째 값은 param이 아닌 url이므로 제거
                matches.shift();

                matches.forEach((paramValue, index) => {
                    params[route.params[index]] = paramValue;
                });

                return params;
            };

            const checkRoutes = () => {
                const currentRoute = routes.find((route) => route.fragmentRegExp.test(window.location.hash));

                // path parameters가 있는 경우
                if (currentRoute.params.length) {
                    currentRoute.component(getUrlParams(currentRoute, window.location.hash));
                }
                // path parameters가 없는 경우
                else {
                    currentRoute.component();
                }
            };

            window.addEventListener('hashchange', checkRoutes);

            checkRoutes();
        },

        /* 인자로 전달 받은 hash 값을 url의 hash에 적용 */
        navigate(fragment, replace = false) {
            if (replace) {
                const href = window.location.href.replace(window.location.hash, '#' + fragment);
                window.location.replace(href);
            } else {
                window.location.hash = fragment;
            }
        }
    };

    return router;
}
