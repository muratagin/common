package com.affinitybox.scheduled.model.enumerator;

public enum EmailResult {

    NOT_SENT("Gönderilmedi"),
    SUCCEED("Başarılı"),
    FAILED("Başarısız");

    private final String text;

    EmailResult(final String text) { this.text = text; }

    public static EmailResult getEmailResult(Integer ordinal) {
        if (ordinal != null) {
            if (ordinal == 0) {
                return EmailResult.NOT_SENT;
            } else if (ordinal == 1) {
                return EmailResult.SUCCEED;
            } else if (ordinal == 2) {
                return EmailResult.FAILED;
            }
        }
        return null;
    }

    @Override
    public String toString() { return text; }
}
