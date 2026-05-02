package ru.konconsulting.loyalty;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import com.vk.api.sdk.VK;
import com.vk.api.sdk.VKTokenExpiredHandler;

public class MainActivity extends BridgeActivity {

    private final VKTokenExpiredHandler vkTokenTracker = new VKTokenExpiredHandler() {
        @Override
        public void onTokenExpired() {
            // Токен истёк, можно показать уведомление
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Инициализация VK SDK
        VK.addTokenExpiredHandler(vkTokenTracker);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        VK.removeTokenExpiredHandler(vkTokenTracker);
    }
}
