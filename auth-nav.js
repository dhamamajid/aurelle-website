(function () {
    var ADMIN_EMAIL_DOMAIN = '@aurelleperfume.com';

    function parseJson(value) {
        try {
            return JSON.parse(value);
        } catch (err) {
            return null;
        }
    }

    function isCompanyAdminEmail(email) {
        return String(email || '').trim().toLowerCase().endsWith(ADMIN_EMAIL_DOMAIN);
    }

    function isOwnerLoggedIn() {
        var authSession = parseJson(localStorage.getItem('aurelleAuthSession'));

        if (!authSession || !authSession.email) {
            return false;
        }

        return isCompanyAdminEmail(authSession.email);
    }

    if (isOwnerLoggedIn()) {
        document.body.classList.add('admin-link-visible');
    } else {
        document.body.classList.remove('admin-link-visible');
    }
})();
