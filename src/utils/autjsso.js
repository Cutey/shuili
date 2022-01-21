import Cookies from 'js-cookie'

const TokenKey = 'SSOAdmin-Token'

export function getTokensso() {
    return Cookies.get(TokenKey)
}

export function setTokensso(token) {
    return Cookies.set(TokenKey, token)

}

export function removeTokensso() {
    return Cookies.remove(TokenKey)
}