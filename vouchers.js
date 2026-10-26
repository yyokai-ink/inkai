class VoucherSystem {
    generateDiscountCode(score) {
        if (score > 5000) return 'YYOKAI-MASTER-20';
        if (score > 2000) return 'YYOKAI-SLICER-10';
        return 'YYOKAI-INK-5';
    }
}
window.VoucherSystem = new VoucherSystem();
