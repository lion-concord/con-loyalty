package com.conloyalty.vkid;

import android.app.Activity;
import android.util.Log;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import com.vk.id.VKID;
import com.vk.id.VKIDAuthFail;
import com.vk.id.AccessToken;
import com.vk.id.auth.VKIDAuthParams;
import com.vk.id.onetap.common.OneTapOAuth;
import com.vk.id.onetap.common.OneTapStyle;

import kotlin.Unit;

@CapacitorPlugin(name = "VkId")
public class VkIdPlugin extends Plugin {
    private static final String TAG = "VkIdPlugin";
    private PluginCall savedCall;
    private VKID vkid;

    @Override
    public void load() {
        super.load();

        Activity activity = getActivity();
        if (activity == null) {
            Log.e(TAG, "Activity not available during load");
            return;
        }

        try {
            // Инициализация VK ID SDK
            vkid = new VKID(activity.getApplicationContext());
            Log.d(TAG, "VK ID SDK initialized successfully");
        } catch (Exception e) {
            Log.e(TAG, "Failed to initialize VK ID SDK", e);
        }
    }

    @PluginMethod
    public void login(PluginCall call) {
        if (vkid == null) {
            call.reject("VK ID SDK not initialized");
            return;
        }

        Activity activity = getActivity();
        if (activity == null) {
            call.reject("Activity not available");
            return;
        }

        savedCall = call;
        savedCall.setKeepAlive(true);

        try {
            // Создаём параметры авторизации
            VKIDAuthParams authParams = new VKIDAuthParams.Builder()
                .build();

            // Запускаем OneTap авторизацию
            OneTapOAuth oneTap = vkid.getOneTap(activity);

            oneTap.startAuth(
                authParams,
                // onSuccess
                accessToken -> {
                    handleSuccess(accessToken);
                    return Unit.INSTANCE;
                },
                // onFail
                fail -> {
                    handleFailure(fail);
                    return Unit.INSTANCE;
                }
            );

        } catch (Exception e) {
            Log.e(TAG, "Error starting VK ID login", e);
            if (savedCall != null) {
                savedCall.reject("Failed to start login: " + e.getMessage(), e);
                savedCall = null;
            }
        }
    }

    private void handleSuccess(AccessToken accessToken) {
        if (savedCall == null) {
            Log.e(TAG, "No saved call for success handler");
            return;
        }

        try {
            JSObject user = new JSObject();
            user.put("id", accessToken.getUserId());

            JSObject response = new JSObject();
            response.put("user", user);
            response.put("accessToken", accessToken.getToken());
            response.put("email", accessToken.getEmail());
            response.put("phone", accessToken.getPhone());

            savedCall.resolve(response);
        } catch (Exception e) {
Log.e(TAG, "Error processing success result", e);
            savedCall.reject("Failed to process login result", e);
        } finally {
            savedCall = null;
        }
    }

    private void handleFailure(VKIDAuthFail fail) {
        if (savedCall == null) {
            Log.e(TAG, "No saved call for failure handler");
            return;
        }

        try {
            String errorMessage = "VK login failed";
            String errorCode = "UNKNOWN";

            if (fail != null) {
                errorMessage = fail.getDescription();

                // Детальная информация об ошибке
                JSObject errorDetails = new JSObject();
                errorDetails.put("message", errorMessage);
                errorDetails.put("description", fail.getDescription());

                Log.e(TAG, "VK ID Auth failed: " + errorMessage);

                savedCall.reject(errorMessage, errorCode, null, errorDetails);
            } else {
                savedCall.reject("VK login cancelled");
            }
        } catch (Exception e) {
            Log.e(TAG, "Error processing failure result", e);
            savedCall.reject("Auth failed with error", e);
        } finally {
            savedCall = null;
        }
    }

    @PluginMethod
    public void logout(PluginCall call) {
        try {
            if (vkid != null) {
                vkid.logout();
            }
            call.resolve();
        } catch (Exception e) {
            Log.e(TAG, "Error during logout", e);
            call.reject("Logout failed", e);
        }
    }

    @PluginMethod
    public void getCurrentUser(PluginCall call) {
        try {
            if (vkid == null || !vkid.isAuthorized()) {
                call.resolve(new JSObject().put("user", JSObject.NULL));
                return;
            }

            AccessToken token = vkid.getAccessToken();
            if (token != null) {
                JSObject user = new JSObject();
                user.put("id", token.getUserId());

                JSObject result = new JSObject();
                result.put("user", user);
                result.put("accessToken", token.getToken());

                call.resolve(result);
            } else {
                call.resolve(new JSObject().put("user", JSObject.NULL));
            }
        } catch (Exception e) {
            Log.e(TAG, "Error getting current user", e);
            call.reject("Failed to get current user", e);
        }
    }
}
