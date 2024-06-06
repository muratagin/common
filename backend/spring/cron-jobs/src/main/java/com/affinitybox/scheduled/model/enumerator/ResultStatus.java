package com.affinitybox.scheduled.model.enumerator;

public enum ResultStatus {

    STARTED("Başlatıldı"),
    SUCCEED("Başarılı"),
    FAILED("Başarısız");

    private final String text;

    ResultStatus(final String text) { this.text = text; }

    public static ResultStatus getResultStatus(Integer ordinal) {
        if (ordinal != null) {
            if (ordinal == 0) {
                return ResultStatus.STARTED;
            } else if (ordinal == 1) {
                return ResultStatus.SUCCEED;
            } else if (ordinal == 2) {
                return ResultStatus.FAILED;
            }
        }
        return null;
    }

    @Override
    public String toString() { return text; }
}
