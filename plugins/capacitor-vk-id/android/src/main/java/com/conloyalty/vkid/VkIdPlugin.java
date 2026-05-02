package com.conloyalty.vkid;

import android.app.Activity;
import android.content.Intent;
import android.util.Log;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;

import com.vk.api.sdk.VK;
import com.vk.api.sdk.auth.VKAuthenticationResult;
import com.vk.api.sdk.auth.VKScope;
import com.vk.sdk.api.users.UsersService;
import com.vk.sdk.api.users.dto.UsersFields;
import com.vk.sdk.api.users.dto.UsersUserFull;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@CapacitorPlugin(name = "VkId")
public class VkIdPlugin extends Plugin {
    private static final String TAG = "VkIdPlugin";
    private static final int VK_LOGIN_REQUEST_CODE = 10101;

    @PluginMethod
    public void login(PluginCall call) {
        Activity activity = getActivity();
        if (activity == null) {
            call.reject("Activity not available");
            return;
        }

        // Запускаем VK авторизацию
        Collection<VKScope> scopes = new ArrayList<>();
        scopes.add(VKScope.EMAIL);
        scopes.add(VKScope.PHONE);

        VK.login(activity, scopes);

        // Сохраняем call для обработки результата
        bridge.saveCall(call);
    }

    @PluginMethod
    public void logout(PluginCall call) {
        VK.logout();
        call.resolve();
    }

    @PluginMethod
    public void getCurrentUser(PluginCall call) {
        if (!VK.isLoggedIn()) {
            call.resolve(new JSObject().put("user", JSObject.NULL));
            return;
        }

        try {
            // Получаем информацию о текущем пользователе
            int userId = VK.getUserId();

            // Запрос к API VK
            List<UsersFields> fields = new ArrayList<>();
            fields.add(UsersFields.PHOTO_200);
            fields.add(UsersFields.CONTACTS);

            UsersService usersService = new UsersService();
            List<Integer> userIds = new ArrayList<>();
            userIds.add(userId);

            // TODO: Выполнить асинхронный запрос к API
            // Пока возвращаем базовую информацию
            JSObject user = new JSObject();
            user.put("id", userId);

            JSObject result = new JSObject();
            result.put("user", user);
            call.resolve(result);

        } catch (Exception e) {
            Log.e(TAG, "Error getting current user", e);
            call.reject("Failed to get current user", e);
        }
    }

    @Override
    protected void handleOnActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == VK_LOGIN_REQUEST_CODE) {
            PluginCall savedCall = bridge.getSavedCall();
            if (savedCall == null) {
                return;
            }

            VKAuthenticationResult result = VK.onActivityResult(requestCode, resultCode, data);

            if (result instanceof VKAuthenticationResult.Success) {
                VKAuthenticationResult.Success successResult = (VKAuthenticationResult.Success) result;

                try {
                    int userId = successResult.token.userId;
                    String accessToken = successResult.token.accessToken;
                    int expiresIn = successResult.token.expiresIn;

                    JSObject user = new JSObject();
                    user.put("id", userId);

                    JSObject response = new JSObject();
                    response.put("user", user);
response.put("accessToken", accessToken);
                    response.put("expiresIn", expiresIn);

                    savedCall.resolve(response);
                } catch (Exception e) {
                    Log.e(TAG, "Error processing VK login result", e);
                    savedCall.reject("Failed to process login result", e);
                }

            } else if (result instanceof VKAuthenticationResult.Failed) {
                VKAuthenticationResult.Failed failedResult = (VKAuthenticationResult.Failed) result;
                savedCall.reject("VK login failed: " + failedResult.exception.getMessage());

            } else {
                savedCall.reject("VK login cancelled");
            }

            bridge.releaseCall(savedCall);
        }
    }
}
